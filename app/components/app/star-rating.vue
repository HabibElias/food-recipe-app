<script setup lang="ts">
const props=withDefaults(defineProps<{readonly?:boolean;value?:number;modelValue?:number;maxStars?:number}>(),{readonly:false,value:0,modelValue:0,maxStars:5});
const emit=defineEmits<{ratingData:[value:number];"update:modelValue":[value:number]}>();
const selected=ref(0);
function rate(value:number){if(props.readonly)return;selected.value=value;emit("ratingData",value);emit("update:modelValue",value);}
</script>
<template><div class="inline-flex gap-1" :role="readonly ? 'img' : 'group'" :aria-label="readonly ? 'Rating: '+value+' out of '+maxStars : 'Choose a rating'"><component :is="readonly ? 'span' : 'button'" v-for="i in maxStars" :key="i" :type="readonly ? undefined : 'button'" :aria-label="readonly ? undefined : 'Rate '+i+' out of '+maxStars" :aria-pressed="readonly ? undefined : i === (selected || modelValue || value)" class="inline-flex w-9 h-9 items-center justify-center rounded-full" @click="rate(i)"><Icon name="lucide:star" size="21" :style="i <= (selected || modelValue || value) ? {fill:'#ffb547',color:'#654008'} : {color:'#7b6a58'}" /></component></div></template>
