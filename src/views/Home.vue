<template>
  <div id="start">
    <div class="container mx-auto px-8 lg:px-4">
      <div class="mt-8 flex justify-between">
        <transition appear name="fade">
          <div class>
            <img
              alt="Scannie Logo"
              class="w-10 cursor-pointer"
              src="../assets/app-icon.svg"
            />
          </div>
        </transition>
        <transition appear name="fade">
          <div
            class="inline-flex flex-row flex-no-wrap items-center self-center justify-around cursor-pointer text-sm font-mono"
          >
            <a
              href="#features"
              class="mr-8 text-black no-underline hover:underline hover:text-green-dark hidden lg:block"
              rel="noopener noreferrer"
              v-smooth-scroll
              >Features</a
            >
            <a href="#start" class="btn bg-green-dark font-bold hidden lg:block" @click="login">Access your documents</a>
          </div>
        </transition>
      </div>
      <div class="mt-8">
        <div
          class="flex flex-col items-center content-center self-center justify-between md:flex-row"
        >
          <div
            class="pr-10 flex flex-col items-start content-start self-start md:mt-24 md:w-1/2 xl:mt-32 xl:pt-12"
          >
            <h1
              class="text-left text-black font-sans font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
            >
              Scannie
            </h1>
            <h2
              class="text-left text-black font-sans font-semi leading-tight mt-8 text-base lg:mt-12 lg:text-2xl"
            >
              Scan your documents and keep them secure forever. 🔐<br>
              With Scannie you can rest assured only you have access to your files and that they're always accessible.
            </h2>
            <p
              class="mt-4 text-left text-black font-sans font-normal leading-normal opacity-75 text-sm md:text-base"
            >
              Scannie is a scanner app where you can store your documents securely.
              It’s open-source and built on top of <a class="text-black hover:text-green-dark" href="https://blockstack.org">Blockstack</a>’s platform.
            </p>
            <transition appear name="fade">
              <div class="mt-6">
                <div v-if="authenticated">Logged in</div>
                <div
                  v-else
                  class="flex flex-col items-start content-start self-stretch"
                > 
                  <a
                    href="https://testflight.apple.com/join/YuXc2asc"
                    target="_blank"
                    class="mt-4 btn-alt pr-8"
                  >
                    <img
                      alt="iOS App Store Logo"
                      class="ml-1 w-5 hidden md:block lg:w-8"
                      src="../assets/svg/apple.svg"
                    />
                    <span
                      class="text-grey-dark font-mono font-bold pt-2 pb-2 lg:pt-0 lg:pb-0 text-xs md:ml-4 md:pr-2 lg:text-sm"
                      >Download our iOS app</span
                    >
                  </a>
                  <a href="https://www.producthunt.com/posts/scannie?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-scannie" 
                  target="_blank"
                  class="mt-4">
                    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=150257&theme=light" alt="Scannie - Secure and end-to-end encrypted document scanner and storage | Product Hunt Embed"/>
                  </a>
                </div>
              </div>
            </transition>
          </div>
          <transition appear name="fadeRight">
            <div class="items-center mt-12 md:mt-24 md:w-1/2">
            <img
              class="rounded md:w-3/5"
              alt="Scannie iPhone"
              src="../assets/img/iPhone.png"
            />
          </div>
          </transition>
        </div>
      </div>
      <div id="features" class="mt-24 md:pt-32">
        <div class="flex flex-col">
          <h2
            class="text-middle md:text-left text-black font-sans font-semi leading-tight text-2xl md:text-3xl lg:text-4xl"
          >
            What makes Scannie unique?
          </h2>
        </div>
        <div class="mt-16">
          <Icon v-bind:iconItems="iconItems"></Icon>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import * as blockstack from "blockstack";

import Footer from "@/components/Footer.vue";
import Icon from "@/components/Icon.vue";

import Access from "../assets/svg/features/access.svg";
import Annotate from "../assets/svg/features/annotate.svg";
import Organize from "../assets/svg/features/organize.svg";
import Scan from "../assets/svg/features/scan.svg";
import Share from "../assets/svg/features/share.svg";
import Vault from "../assets/svg/features/vault.svg";


export default {
  name: "home",
  methods: {
    login() {
      const { origin } = window.location;
      blockstack.redirectToSignIn(origin, `${origin}/manifest.json`, [
        "store_write",
        "publish_data"
      ]);
    }
  },
  data() {
    return {
      authenticated: this.$store.state.isAuthenticated,
      typerItems: [
        "happy memories",
        "family trips",
        "old friendships",
        "your friends",
        "loved ones",
        "your stories",
        "special moments",
        "past adventures",
        "holidays abroad"
      ],
      iconItems: [
        {
          icon_id: 1,
          icon_opacity: "opacity: 1;",
          icon_color: "color: #111111",
          icon_svg: Scan,
          icon_title: "Intelligent scan",
          icon_paragraph:
            "Scannie live scans your documents to capture the shot that maximizes readability."
        },
        {
          icon_id: 2,
          icon_opacity: "opacity: 1",
          icon_color: "color: #111111",
          icon_svg: Vault,
          icon_title: "Secure storage",
          icon_paragraph:
            "Scans are automatically saved encrypted on the storage of your choice via Blockstack."
        },
        {
          icon_id: 3,
          icon_opacity: "opacity: 1",
          icon_color: "color: #111111",
          icon_svg: Access,
          icon_title: "Access anywhere",
          icon_paragraph:
            "After scanning and storing your documents they will be accessible via the iOS application and the browser."
        },
        {
          icon_id: 4,
          icon_opacity: "opacity: 1",
          icon_color: "color: #111111",
          icon_svg: Organize,
          icon_title: "Organize (soon)",
          icon_paragraph:
            "Create folders to separate your scanned documents to keep everything organized."
        },
        {
          icon_id: 5,
          icon_opacity: "opacity: 0.5",
          icon_color: "color: grey;",
          icon_svg: Annotate,
          icon_title: "Annotate (soon)",
          icon_paragraph:
            "Leave notes and comments for each document in order to keep all your information synced."
        },
        {
          icon_id: 6,
          icon_opacity: "opacity: 0.5",
          icon_color: "color: grey;",
          icon_svg: Share,
          icon_title: "Share (soon)",
          icon_paragraph:
            "Soon you'll be able to share documents with only the people you want while keeping the same level of security."
        }
      ],
    };
  },
  components: {
    Footer,
    Icon
  }
};
</script>
