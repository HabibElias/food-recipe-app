<script setup lang="ts">
definePageMeta({ layout: "default" });
</script>

<template>
  <div class="min-h-screen py-12 border border-base-content/50 rounded-4xl">
    <div class="max-w-5xl mx-auto space-y-16 px-4">
      <!-- Hero -->
      <section class="text-center">
        <div class="badge badge-primary font-button-text mb-4">
          ABOUT
        </div>
        <h1 class="font-headline-1 mb-4">
          Our Story & Mission
        </h1>
        <p class="font-paragraph-2 text-base-content/70 max-w-3xl mx-auto">
          We create delightful, easy-to-follow recipes so everyone can enjoy cooking. Our mission is to
          inspire home cooks with delicious, approachable recipes and a friendly community.
        </p>
      </section>

      <!-- Values / Mission -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card p-6">
          <h3 class="font-subtitle">
            Quality
          </h3>
          <p class="font-paragraph-2 text-sm text-base-content/70 mt-2">
            We curate recipes with clear steps and fresh ingredients.
          </p>
        </div>
        <div class="card p-6">
          <h3 class="font-subtitle">
            Community
          </h3>
          <p class="font-paragraph-2 text-sm text-base-content/70 mt-2">
            A place for food lovers to share, save and enjoy recipes together.
          </p>
        </div>
        <div class="card p-6">
          <h3 class="font-subtitle">
            Accessibility
          </h3>
          <p class="font-paragraph-2 text-sm text-base-content/70 mt-2">
            Recipes for all skill levels with helpful tips and variations.
          </p>
        </div>
      </section>

      <!-- Team -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-header-3">
            Meet The Team
          </h2>
          <nuxt-link to="/browse" class="btn btn-ghost btn-sm">
            Browse Other Categories
          </nuxt-link>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="card p-4 text-center">
            <div class="avatar mx-auto mb-3">
              <div class="w-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                AB
              </div>
            </div>
            <div class="font-bold">
              A. B. Elias
            </div>
            <div class="text-sm text-base-content/70">
              Founder & Lead Curator
            </div>
          </div>
          <div class="card p-4 text-center">
            <div class="avatar mx-auto mb-3">
              <div class="w-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                CD
              </div>
            </div>
            <div class="font-bold">
              C. D. Chef
            </div>
            <div class="text-sm text-base-content/70">
              Recipe Developer
            </div>
          </div>
          <div class="card p-4 text-center">
            <div class="avatar mx-auto mb-3">
              <div class="w-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                EF
              </div>
            </div>
            <div class="font-bold">
              E. F. Dev
            </div>
            <div class="text-sm text-base-content/70">
              Product & Tech
            </div>
          </div>
        </div>
      </section>

      <!-- Contact / CTA -->
      <section class="card w-fit">
        <div class="flex flex-col gap-4">
          <div>
            <h3 class="font-subtitle">
              Get in touch
            </h3>
            <p class="font-paragraph-2 text-sm text-base-content/70 mt-2">
              Have feedback or want to contribute a recipe? Send us a message.
            </p>
          </div>
          <form class="min-w-sm">
            <div class="form-control flex flex-col items-start">
              <input class="input input-bordered mb-2 w-sm" placeholder="Your name">
              <input class="input input-bordered mb-2 w-sm" placeholder="Your email">
              <textarea class="textarea textarea-bordered mb-2 w-sm" placeholder="Message" rows="3" />
              <button type="button" class="btn btn-primary w-sm">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
