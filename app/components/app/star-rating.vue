<script>
import { ref } from "vue";

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: 0,
    },
    maxStars: {
      type: Number,
      default: 5,
    },
  },
  emits: ["ratingData"],
  setup(props, { emit }) {
    const rating = ref(props.value);
    const isHovered = ref(false);
    const hoverValue = ref(0);

    const setRating = (newRating) => {
      if (props.readonly)
        return;
      rating.value = newRating;
      emit("ratingData", newRating);
    };

    const hoverRating = (value) => {
      if (props.readonly)
        return;

      if (isHovered.value) {
        hoverValue.value = value;
      }
    };

    const resetHover = () => {
      hoverValue.value = 0;
    };

    return {
      rating,
      isHovered,
      hoverRating,
      resetHover,
      setRating,
    };
  },
};
</script>

<template>
  <div class="star-rating">
    <div
      v-for="i in maxStars"
      :key="i"
      class="star" :class="[i <= (isHovered ? hoverValue : rating) ? 'filled' : '']"
      @click="setRating(i)"
      @mouseover="hoverRating(i)"
      @mouseleave="resetHover"
    >
      ★
    </div>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-block;
}

.star {
  display: inline-block;
  font-size: 24px;
  cursor: pointer;
  margin: 2px;
  color: rgb(222, 222, 222);
}

.filled {
  color: gold;
}
</style>
