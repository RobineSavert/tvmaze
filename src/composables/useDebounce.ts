import { ref, watch, type Ref } from "vue";

export function useDebounce<T>(source: Ref<T>, delay = 400) {
  const debounced = ref(source.value) as Ref<T>;

  let timeout: ReturnType<typeof setTimeout>;

  watch(source, (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debounced.value = value;
    }, delay);
  });

  return debounced;
}
