<template>
  <div @drop="uploadFile" @dragover.prevent>
    <div class="mw9 center ph3-ns">
      <div class="cf ph2-ns">
        <div class="fl w-100 w-75-ns pa2">
          <div class="bg-white pv4 tl">
            <div v-if="Object.keys(groupedDocuments).length != 0">
              <div
                v-for="date in Object.keys(groupedDocuments).sort().reverse()"
                :key="date"
              >
                <div class="cf mb4">
                  <h1 class="f3 lh-copy">
                    {{ groupedDocuments[date].date.format("ddd, MMM DD YYYY") }}
                  </h1>
                  <div
                    v-for="(pdfDocument, index) in groupedDocuments[date].documents"
                    :key="pdfDocument.uploadedAt"
                  >
                    <div
                      v-bind:class="{ 'fl w-50': true, 'w-25-ns': index != 4 }"
                    >
                      <Document :instance="pdfDocument" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="tc mt5 mb7">
              <div>
                <img
                  alt="Upload your documents"
                  src="@/assets/collect-documents.svg"
                  width="300"
                />
              </div>
              <div>
                <h1>Drop your documents here to upload</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Document from "../components/Document.vue";

export default {
  name: "Dashboard",
  data() {
    return {
      documents: this.$store.state.DocumentStore
    };
  },
  computed: {
    groupedDocuments() {
      const byday = {};
      const documents = this.documents.documents || [];
      documents.forEach(pdfDocument => {
        const d = pdfDocument.bestDate();
        byday[d] = byday[d] || {};
        byday[d].date = pdfDocument.bestMoment();
        byday[d].documents = byday[d].documents || [];
        byday[d].documents.push(pdfDocument);
      });
      console.log("byday: " + byday);
      return byday;
    }
  },
  components: {
    Document
  },
  methods: {
    uploadFile(e) {
      e.stopPropagation();
      e.preventDefault();

      const { files } = e.dataTransfer;
      this.$store.dispatch("DocumentStore/create", files);
    }
  },
  mounted() {
    this.$store.dispatch("DocumentStore/index");
  }
};
</script>
