<template>
  <button
    class="inline-flex items-center gap-2 text-sm text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/50"
    @click="router.push('/')"
  >
    ← Back to dashboard
  </button>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>
