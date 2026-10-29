<script setup lang="ts">
const props = withDefaults(defineProps<{
  readonly?: boolean;
  disabled?: boolean;
  value?: number;
  modelValue?: number;
  maxStars?: number;
}>(), { readonly: false, disabled: false, maxStars: 5 });
const emit = defineEmits<{
  ratingData: [value: number];
  "update:modelValue": [value: number];
}>();
const group = ref<HTMLElement | null>(null);
const preview = ref<number | null>(null);
const selected = computed(() => props.modelValue ?? props.value ?? 0);
const displayed = computed(() => preview.value ?? selected.value);

function rate(value: number) {
  if (props.readonly || props.disabled) return;
  emit("update:modelValue", value);
  emit("ratingData", value);
}

function onKeydown(event: KeyboardEvent, index: number) {
  const keys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"];
  if (!keys.includes(event.key) || props.readonly || props.disabled) return;
  event.preventDefault();
  const next = event.key === "Home" ? 1 : event.key === "End" ? props.maxStars
    : ["ArrowRight", "ArrowUp"].includes(event.key) ? index % props.maxStars + 1
      : (index + props.maxStars - 2) % props.maxStars + 1;
  preview.value = null;
  rate(next);
  group.value?.querySelector<HTMLButtonElement>(`[data-star="${next}"]`)?.focus();
}
</script>
<template>
  <div class="rating-picker">
    <div ref="group" class="rating-stars" :role="readonly ? 'img' : 'radiogroup'" :aria-label="readonly ? `Rating: ${selected} out of ${maxStars}` : 'Choose a rating'" @pointerleave="preview = null">
      <component :is="readonly ? 'span' : 'button'" v-for="i in maxStars" :key="i"
        :type="readonly ? undefined : 'button'" :role="readonly ? undefined : 'radio'"
        :aria-label="readonly ? undefined : `Rate ${i} out of ${maxStars}`"
        :aria-checked="readonly ? undefined : i === selected"
        :tabindex="readonly ? undefined : i === (selected || 1) ? 0 : -1"
        :disabled="readonly ? undefined : disabled" :data-star="i"
        class="rating-star" :class="{ 'is-filled': i <= displayed, 'is-selected': i === selected }"
        @pointerenter="!readonly && !disabled && (preview = i)" @click="rate(i)" @keydown="onKeydown($event, i)">
        <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91L12 3Z" />
        </svg>
      </component>
    </div>
    <span v-if="!readonly" class="rating-caption" aria-hidden="true">{{ displayed ? `${displayed} of ${maxStars} stars` : 'Choose your stars' }}</span>
  </div>
</template>
