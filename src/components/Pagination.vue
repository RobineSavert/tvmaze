<template>
  <!--
    Only render pagination if there is more than 1 page.
    If totalAmountOfPages <= 1, pagination UI is not needed.
  -->
  <div
    v-if="totalAmountOfPages > 1"
    class="flex lg:flex-row gap-3 text-center flex-col items-center justify-between"
  >
    <!--
      Shows the current item range:
      "Showing X to Y of Z episodes"
      startVar and endVar are calculated based on current page.
    -->
    <div class="text-sm text-zinc-300 order-1 lg:order-0">
      <span class="font-medium">Showing </span>
      <span class="font-semibold">{{ startVar + 1 }}</span>
      <span class="text-zinc-400"> to </span>
      <span class="font-semibold">{{ endVar }}</span>
      <span class="text-zinc-400"> of </span>
      <span class="font-semibold">{{ totalItemCountResolved }}</span>
      <span class="text-zinc-400"> episodes</span>
    </div>

    <!-- controls -->
    <nav aria-label="Pagination" class="flex items-center justify-end">
      <ul class="flex items-center gap-1">
        <!-- previous button -->
        <!-- Disabled on first page -->
        <li>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page === 1"
            @click="backPage"
            aria-label="Previous page"
          >
            ‹
          </button>
        </li>

        <!-- first page -->
        <!--
          Always render page 1.
          If we're on page 1, we render active span
          Otherwise we render clickable button.
        -->
        <li>
          <button
            v-if="page !== 1"
            type="button"
            class="min-w-9 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
            @click="goToPage(1)"
            aria-label="Go to page 1"
          >
            1
          </button>

          <span
            v-else
            class="min-w-9 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-semibold text-white"
            aria-label="Current page"
          >
            1
          </span>
        </li>

        <!-- left ellipsis -->
        <!--
          Shown when middle page window does not start directly after 1.
          Prevents long sequences like 1 2 3 4 5 6 7 8...
        -->
        <li v-if="showLeftEllipsis">
          <span class="min-w-9 px-2 text-center text-sm text-zinc-500">…</span>
        </li>

        <!-- middle pages -->
        <!--
          Dynamically calculated window of pages around current page.
          Never includes 1 or last page.
        -->
        <li v-for="p in middlePages" :key="`p-${p}`">
          <button
            v-if="p !== page"
            type="button"
            class="min-w-9 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
            @click="goToPage(p)"
            :aria-label="`Go to page ${p}`"
          >
            {{ p }}
          </button>

          <!-- Active page -->
          <span
            v-else
            class="min-w-9 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-semibold text-white"
            aria-label="Current page"
          >
            {{ p }}
          </span>
        </li>

        <!-- right ellipsis -->
        <!-- Shown when window does not reach the last page -->
        <li v-if="showRightEllipsis">
          <span class="min-w-9 px-2 text-center text-sm text-zinc-500">…</span>
        </li>

        <!-- last page -->
        <!--
          Always render last page if > 1.
          Active if current page equals last.
        -->
        <li v-if="totalAmountOfPages > 1">
          <button
            v-if="page !== totalAmountOfPages"
            type="button"
            class="min-w-9 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
            @click="goToPage(totalAmountOfPages)"
            :aria-label="`Go to page ${totalAmountOfPages}`"
          >
            {{ totalAmountOfPages }}
          </button>

          <span
            v-else
            class="min-w-9 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-semibold text-white"
            aria-label="Current page"
          >
            {{ totalAmountOfPages }}
          </span>
        </li>

        <!-- next button -->
        <!-- Disabled when on last page -->
        <li>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page >= totalAmountOfPages"
            @click="nextPage"
            aria-label="Next page"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";

// Range emitted to parent:
// [startIndex, endIndex]

type PageRange = [number, number];

// Props:
// items: array of items being paginated
// perPage: how many items per page
// totalItemCount: optional override (example: server pagination)
// maximumPagesShownAhead/Before: window size

const props = withDefaults(
  defineProps<{
    items: unknown[];
    perPage?: number;
    totalItemCount?: number;
    maximumPagesShownAhead?: number;
    maximumPagesShownBefore?: number;
  }>(),
  {
    perPage: 1,
    totalItemCount: 0,
    maximumPagesShownAhead: 3,
    maximumPagesShownBefore: 3,
  },
);

// Emit event whenever page changes.
// Parent receives range + current page.

const emit = defineEmits<{
  (e: "page-changed", range: PageRange, page: number): void;
}>();

// Determine total items:
// we use totalItemCount if provided
// otherwise fallback to items.length

const totalItemCountResolved = computed(() =>
  props.totalItemCount > 0 ? props.totalItemCount : props.items.length,
);

// Current page state

const page = ref(1);

// Current slice indexes

const startVar = ref(0);
const endVar = ref(props.perPage);

// Total number of pages

const totalAmountOfPages = computed(() => {
  const total = totalItemCountResolved.value;
  return total === 0 ? 0 : Math.ceil(total / props.perPage);
});

// Calculates slice range for current page
// Emits updated range to parent

function calcItemRange() {
  startVar.value = (page.value - 1) * props.perPage;
  endVar.value = startVar.value + props.perPage;

  const total = totalItemCountResolved.value;

  if (endVar.value > total) {
    endVar.value = total;
  }

  emit("page-changed", [startVar.value, endVar.value], page.value);
}

// Navigate to specific page
// Includes clamping to prevent invalid page numbers

function goToPage(numPage: number) {
  if (totalAmountOfPages.value === 0) {
    return;
  }

  const next = Math.min(Math.max(numPage, 1), totalAmountOfPages.value);
  page.value = next;
  calcItemRange();
}

// Go forward one page

function nextPage() {
  if (page.value < totalAmountOfPages.value) {
    page.value += 1;
    calcItemRange();
  }
}

// Go back one page

function backPage() {
  if (page.value > 1) {
    page.value -= 1;
    calcItemRange();
  }
}

// Compute dynamic "window" of pages around current page.
// Never includes page 1 or last page.

const middlePages = computed(() => {
  const last = totalAmountOfPages.value;
  // return early
  if (last <= 2) {
    return [];
  }

  const start = Math.max(2, page.value - props.maximumPagesShownBefore);
  const end = Math.min(last - 1, page.value + props.maximumPagesShownAhead);

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return pages.filter((p) => p !== 1 && p !== last);
});

// Determine whether left ellipsis is needed

const showLeftEllipsis = computed(() => {
  // return early
  if (totalAmountOfPages.value <= 4) {
    return false;
  }

  const firstMid = middlePages.value[0];

  // If we have a calculated middle page window, show a left ellipsis when that window doesn’t start directly after page 1.
  // If we don’t have a window, show the ellipsis when we are beyond page 2.
  if (firstMid !== undefined) {
    return firstMid > 2;
  }

  return page.value > 2;

});


 // Determine whether right ellipsis is needed

const showRightEllipsis = computed(() => {
  const last = totalAmountOfPages.value;

  if (last <= 4) {
    return false;
  }

  const mids = middlePages.value;
  const lastMid = mids.length ? mids[mids.length - 1] : undefined;

  if (lastMid !== undefined) {
    return lastMid < last - 1;
  }

  return page.value < last - 1;
});


// Reset pagination when:
// - items length changes
// - total count changes
// - perPage changes

watch(
  () =>
    [props.items.length, totalItemCountResolved.value, props.perPage] as const,
  () => {
    page.value = 1;
    calcItemRange();
  },
  { immediate: true },
);
</script>
