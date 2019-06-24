import Vue from "vue";
import { writeFile, readFile } from "blockstack-large-storage";
import imageCompression from "browser-image-compression";
import Document from "@/models/document";

const DocumentStore = {
  namespaced: true,
  state: {
    loading: false,
    documents: []
  },
  mutations: {
    loading(state, status) {
      const tmpState = state;
      tmpState.loading = status;
      return tmpState;
    },
    many(state, data) {
      const tmpState = state;
      tmpState.documents = data;
      return tmpState;
    },
    prepend(state, data) {
      const tmpState = state;
      tmpState.documents.unshift(data);
      return tmpState;
    },
    remove(state, pdfDocument) {
      const tmpState = state;
      const documents = tmpState.documents.filter(
        element => element.uuid !== pdfDocument.uuid
      );
      tmpState.documents = documents;
      return tmpState;
    }
  },
  actions: {
    index(context) {
      console.log("index");
      // context.commit("loading", false);
      context.commit("loading", true);
      const readOptions = { decrypt: true };
      console.log("readFile");
      readFile("documents.json", readOptions)
        .then(file => {
          console.log("readFile success");
          const documents = JSON.parse(file || "[]");
          documents.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
          const parsedDocuments = documents.map(p => {
            const pdfDocument = new Document();
            pdfDocument.fromObject(p);
            return pdfDocument;
          });
          console.log("readFile parsedDocuments", parsedDocuments);
          context.commit("many", parsedDocuments);
          context.commit("loading", false);
        })
        .catch(() => {
          console.log("readFile error");
          context.commit("loading", false);
        });
    },
    create(context, files) {
      context.commit("loading", true);

      const writeOptions = { encrypt: true };
      const readOptions = { decrypt: true };
      const numberOfFiles = Array.from(files).length;

      const displayError = () => {
        Vue.notify({
          group: "errors",
          title: "Error storing document",
          text: "There was an error storing your document. Please try again.",
          type: "error"
        });
      };

      readFile("documents.json", readOptions).then(documentsFile => {
        let processedFiles = 0;
        const documents = JSON.parse(documentsFile || "[]");

        const documentProcessed = () => {
          processedFiles += 1;
          if (processedFiles === numberOfFiles * 2) {
            const jsonString = JSON.stringify(documents);
            writeFile("documents.json", jsonString, writeOptions).catch(() => {
              displayError();
            });
            context.commit("loading", false);
          }
        };

        Array.from(files).forEach(file => {
          const pdfDocument = new Document();
          pdfDocument.setFile(file);
          documents.unshift(pdfDocument);

          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result;

            imageCompression(file, 0.1, 800)
              .then(compressedFile => {
                writeFile(pdfDocument.compressedPath, compressedFile, writeOptions);
                documentProcessed();
              })
              .catch(() => {
                displayError();
                documentProcessed();
              });
            writeFile(pdfDocument.path, arrayBuffer, writeOptions)
              .then(() => {
                context.commit("prepend", pdfDocument);
                documentProcessed();
              })
              .catch(() => {
                displayError();
                documentProcessed();
              });
          };
          reader.readAsArrayBuffer(file);
        });
      });
    },
    remove(context, pdfDocument) {
      context.commit("loading", true);
      const writeOptions = { encrypt: true };
      const readOptions = { decrypt: true };
      readFile("documents.json", readOptions).then(documentsFile => {
        const documents = JSON.parse(documentsFile || "[]");
        const index = documents.findIndex(element => element.uuid === pdfDocument.uuid);
        documents.splice(index, 1);
        const jsonString = JSON.stringify(documents);
        writeFile("documents.json", jsonString, writeOptions).then(() => {
          writeFile(pdfDocument.path, "", writeOptions).then(() => {
            context.commit("remove", pdfDocument);
            context.commit("loading", false);
          });
          writeFile(pdfDocument.compressedPath, "", writeOptions);
        });
      });
    }
  }
};

export default DocumentStore;
