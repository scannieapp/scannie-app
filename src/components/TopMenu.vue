<template>
  <div class="top-menu w-100 bg-light-gray pa3">
    <div class="mw9 center ph3-ns">
      <div class="cf ph2-ns">
        <div class="fl w-100 w-50-ns pa2">
          <div class="tl f6">
            <a href="#" @click="logout" style="text-decoration:none" class="gray mh2">
              Hi, {{ user.username }}!
            </a>
          </div>
        </div>
        <div class="fl w-100 w-50-ns pa2">
          <div class="tr f6">
            <a href="https://apps.apple.com/us/app/scannie/id1456235867" style="text-decoration:none" class="text-grey-dark mh2">
              Scan with our iOS app
            </a>
            <a href="#" @click="$refs.file.click()" style="text-decoration:none" class="green mh2">
              Upload documents
            </a>
            <input
              type="file"
              ref="file"
              id="upload-file-input"
              multiple
              @change="filesChange($event.target.name, $event.target.files)"
              accept="pdf/*"
              class="input-file"
              v-show="false"
            />
            <a href="#" @click="logout" style="text-decoration:none" class="gray mh2">
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
    <Loading
      :active.sync="this.$store.state.DocumentStore.loading"
      :can-cancel="false"
      :is-full-page="true"
    ></Loading>
  </div>
</template>

<script>
import * as blockstack from "blockstack";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "TopMenu",
  components: {
    Loading
  },
  methods: {
    logout() {
      blockstack.signUserOut(window.location.origin);
    },
    filesChange(name, files) {
      this.$store.dispatch("DocumentStore/create", files);
    }
  },
  data() {
    return {
      user: this.$store.state.UserStore,
    };
  },
  mounted() {
    this.$store.dispatch("UserStore/index");
  }
};
</script>

<style scoped></style>
