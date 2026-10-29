<script setup lang="ts">
useSeoMeta({title:"Cooking tips · Bowlup",description:"Small, practical habits that make everyday cooking easier."});
const tips=[
 {title:"Read it once before you start.",text:"Check every step and ingredient before turning on the heat. Set out your pan, utensils and anything that needs measuring. A minute here makes the rest feel calmer."},
 {title:"Give your pan a little space.",text:"Too much food in one pan traps moisture. For browned vegetables or chicken, use a wide pan and cook in batches if you need to. Let the surface get hot before adding the food."},
 {title:"Taste as you go.",text:"For dishes that are safe to taste, check the seasoning as they cook. Add salt a little at a time. A squeeze of lemon near the end can brighten a soup or stew that tastes flat. Never taste raw meat, eggs or batter."},
 {title:"Use temperature for doneness.",text:"A food thermometer is more reliable than color. Cook chicken to 74°C / 165°F in the thickest part, ground meat to 71°C / 160°F, and fish to 63°C / 145°F. Keep raw meat and its utensils separate from ready-to-eat food."},
 {title:"Let leftovers cool safely.",text:"Refrigerate cooked food within two hours, or one hour if the room is hotter than 32°C / 90°F. Use shallow containers so it cools quickly. Eat refrigerated leftovers within three to four days and reheat to 74°C / 165°F."},
 {title:"Make the recipe your own, gently.",text:"Swap herbs, add a vegetable, or adjust the heat. When baking, keep the basic flour, liquid and raising-agent ratios until you know how the recipe works. Write down the changes you'd make next time."}
];
</script>
<template>
 <section class="reading-page"><header class="page-heading"><h1>A little confidence in the kitchen.</h1><p>Small habits. Better dinners. Start with the one that helps you tonight.</p></header><div class="reading-copy tips-list"><section v-for="tip in tips" :key="tip.title"><h2>{{ tip.title }}</h2><p>{{ tip.text }}</p></section><NuxtLink to="/browse" class="btn btn-primary">Put a tip to good use<Icon name="lucide:arrow-right" size="18" /></NuxtLink></div></section>
</template>
