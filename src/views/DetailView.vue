<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100">
    <div class="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      <BackToDashboard />

      <Error v-if="error" :error="error" />

      <Loader v-if="isLoading" />

      <div
        v-else-if="show"
        class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm"
      >
        <div class="flex flex-col gap-6 lg:flex-row">
          <div class="lg:w-[18rem]">
            <PosterImage
              :show="show"
              imageClass="h-[22rem]"
              loading="eager"
              fetchPriority="high"
            />

            <div class="mt-4 flex flex-wrap gap-2">
              <ShowGenres :genres="show.genres" />
              <ShowRating :rating="show.rating" />
            </div>
          </div>

          <div class="flex-1">
            <ShowInfo :show="show" />

            <ShowSummary :summary="show.summary" variant="detail" />

            <ShowCast :cast="cast" />
          </div>
        </div>
        <ShowEpisodes :episodes="episodes" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useShowDetailStore } from "../stores/store-show-details";

import Loader from "../components/Loader.vue";
import BackToDashboard from "../components/BackToDashboard.vue";
import PosterImage from "../components/PosterImage.vue";
import ShowSummary from "../components/ShowSummary.vue";
import ShowCast from "../components/ShowCast.vue";
import ShowEpisodes from "../components/ShowEpisodes.vue";
import ShowGenres from "../components/ShowGenres.vue";
import ShowRating from "../components/ShowRating.vue";
import ShowInfo from "../components/ShowInfo.vue";
import Error from "../components/Error.vue";

const route = useRoute();

const store = useShowDetailStore();
const { show, cast, episodes, isLoading, error } = storeToRefs(store);

const id = computed(() => Number(route.params.id));

watch(id, (newId) => store.load(newId), { immediate: true });

onUnmounted(() => {
  store.reset();
});
</script>
