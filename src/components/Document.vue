<template>
  <div class="document" v-observe-visibility="visibilityChanged">
    <Loading
      :active.sync="loading"
      :can-cancel="false"
      :is-full-page="false"
    ></Loading>

    <div
      class="db aspect-ratio aspect-ratio--1x1 photo-link"
    >
      <img
        v-bind:src="compressedLocalImageURL || fullLocalImageURL"
        style="position: absolute;left:0;top:0;width:100%;height: 100%;"
        alt=""
      />
    </div>

    <div class="photo-options ph2">
      <div class="tc">
        <a href="#" @click="downloadDocument" class="icon dib white">
          <font-awesome-icon icon="download" />
        </a>
        <a href="#" @click="remove" class="icon dib white">
          <font-awesome-icon icon="trash" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { readFile } from "blockstack-large-storage";
import Loading from "vue-loading-overlay";
import exif from "exif-js";
import pdfDocument from "@/models/document";

export default {
  name: "Document",
  data() {
    return {
      downloaded: false,
      fullLocalImageURL: null,
      compressedLocalImageURL: null,
      loading: false
    };
  },
  props: {
    instance: pdfDocument
  },
  components: {
    Loading
  },
  methods: {
    remove(e) {
      e.preventDefault();
      this.$store.dispatch("DocumentStore/remove", this.instance);
    },
    downloadDocument(e) {
      e.preventDefault();
      if (this.fullLocalImageURL) {
        const anchor = document.createElement("a");
        anchor.href = this.fullLocalImageURL;
        anchor.target = "_blank";
        anchor.download = this.instance.name;
        anchor.click();
      } else {
        this.$store.commit("DocumentStore/loading", true);
        // readFile(this.instance.path).then(data => {
        //   const file = new Blob([data], { type: "image/jpeg" });
        //   resetImageOrientation(file, blob => {
        //     this.$store.commit("DocumentStore/loading", false);
        //     this.fullLocalImageURL = blob;
        //     const anchor = document.createElement("a");
        //     anchor.href = blob;
        //     anchor.target = "_blank";
        //     anchor.download = this.instance.name;
        //     anchor.click();
        //   });
        // });
      }
    },
    visibilityChanged(isVisible) {
      if (isVisible && this.downloaded === false) {
        this.downloaded = true;
        this.download();
      }
    },
    download() {
      this.loading = true;
      readFile(this.instance.compressedPath).then(
        data => {
          const file = new Blob([data], { type: "image/jpeg" });

          if (this.instance.compressedPath) {
            const img = new Image();

            img.onload = () => {
              exif.getData(img, () => {
                const { width, height } = img;
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;                

                ctx.drawImage(img, 0, 0);
                canvas.toBlob(
                  blob => {
                    this.loading = false;
                    this.compressedLocalImageURL = URL.createObjectURL(blob);
                  },
                  "image/jpeg",
                  0.5
                );
              });
            };

            img.src = URL.createObjectURL(file);
          } else {
            // resetImageOrientation(file, blob => {
            //   this.loading = false;
            //   if (this.instance.compressedPath) {
            //     this.compressedLocalImageURL = blob;
            //   } else {
            //     this.fullLocalImageURL = blob;
            //   }
            // });
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.photo {
  position: relative;
}

img {
  object-fit: cover;
}

.photo:hover > .photo-link > img {
  opacity: 0.5;
}

.photo-options {
  width: 80px;
  height: 40px;
  background-color: rgb(70, 121, 231);
  line-height: 40px;
  visibility: hidden;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 999;
  border-radius: 0 0 0 20px;
}

.photo-options .icon {
  margin-left: 6px;
  margin-right: 6px;
}

.photo:hover .photo-options {
  visibility: visible;
}
</style>
