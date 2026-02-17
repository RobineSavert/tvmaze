<template>
  <div
    class="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
  >
    {{ error }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: string }>();
</script>
