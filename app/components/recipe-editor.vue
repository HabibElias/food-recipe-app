<script setup lang="ts">
import INSERT from "~~/server/_mutations/InsertRecipeMutation.gql";
import GET from "~~/server/_queries/GetRecipeLoggedIn.gql";
import UPLOAD from "~~/server/_mutations/UploadRecipeImagesMutation.gql";
const props=defineProps<{recipeId?:number}>();
const user=useUserStore();const client=useApolloClient().client;
const id=ref<number|undefined>(props.recipeId);
const form=reactive({title:"",description:"",category_id:0,prep_time:30,is_paid:false,price:0});
const ingredients=ref([""]);const steps=ref([""]);const categories=ref<any[]>([]);const existingImages=ref<any[]>([]);
const files=ref<File[]>([]);const previews=ref<string[]>([]);const saving=ref(false);const error=ref("");const allowed=ref(true);
const canUpload=ref(false);const canPay=ref(false);
const SAVE=gql("mutation SaveRecipe($id:Int!,$title:String!,$category_id:Int!,$description:String!,$is_paid:Boolean!,$prep_time:Int!,$price:numeric,$ingredients:[recipe_ingredient_insert_input!]!,$steps:[recipe_step_insert_input!]!){update_recipe(where:{id:{_eq:$id}},_set:{title:$title,category_id:$category_id,description:$description,is_paid:$is_paid,prep_time:$prep_time,price:$price}){affected_rows} delete_recipe_ingredient(where:{recipe_id:{_eq:$id}}){affected_rows} insert_recipe_ingredient(objects:$ingredients){affected_rows} delete_recipe_step(where:{recipe_id:{_eq:$id}}){affected_rows} insert_recipe_step(objects:$steps){affected_rows}}");
try{
 const {data}=await client.query({query:gql("{category(order_by:{category_name:asc}){id category_name} __schema{mutationType{fields{name}}}}")});
 categories.value=data.category;form.category_id=categories.value[0]?.id||0;
 const names=data.__schema.mutationType.fields.map((x:any)=>x.name);canUpload.value=names.includes("uploadRecipeImages");canPay.value=names.includes("initializePayment");
 if(id.value){const {data}=await client.query({query:GET,variables:{id:id.value,user_id:user.user?.id},fetchPolicy:"network-only"});const r=data.recipe[0];if(!r || r.user_id!==user.user?.id)allowed.value=false;else{Object.assign(form,{title:r.title,description:r.description,category_id:r.category.id,prep_time:r.prep_time,is_paid:r.is_paid,price:Number(r.price)});ingredients.value=r.recipe_ingredients.map((x:any)=>x.ingredient);steps.value=r.recipe_steps.map((x:any)=>x.step_description);existingImages.value=r.recipe_images;}}
}catch{error.value="We couldn't get the kitchen ready. Please refresh and try again.";}
function pickPhotos(event:Event){
 const picked=Array.from((event.target as HTMLInputElement).files||[]);
 if(picked.length>5 || picked.some(f=>f.size>10*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(f.type))){error.value="Choose up to 5 JPG, PNG or WebP photos, each under 10 MB.";return;}
 previews.value.forEach(url=>URL.revokeObjectURL(url));files.value=picked;previews.value=picked.map(file=>URL.createObjectURL(file));error.value="";
}
onBeforeUnmount(()=>previews.value.forEach(url=>URL.revokeObjectURL(url)));
async function photoData(file:File):Promise<string>{return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]||"");reader.onerror=reject;reader.readAsDataURL(file);});}
async function save(){
 error.value="";const cleanIngredients=ingredients.value.map(x=>x.trim()).filter(Boolean);const cleanSteps=steps.value.map(x=>x.trim()).filter(Boolean);
 if(!cleanIngredients.length || !cleanSteps.length){error.value="Add at least one ingredient and one cooking step.";return;}
 if(form.is_paid && (!Number.isFinite(Number(form.price)) || Number(form.price)<=0)){error.value="Add a price greater than zero for a paid recipe.";return;}
 saving.value=true;let persisted=false;
 try{
  if(id.value){const result=await client.mutate({mutation:SAVE,variables:{...form,id:id.value,price:form.is_paid?Number(form.price):0,ingredients:cleanIngredients.map(ingredient=>({recipe_id:id.value,ingredient})),steps:cleanSteps.map((step_description,i)=>({recipe_id:id.value,step_description,step_no:i+1}))}});if(result.data.update_recipe.affected_rows!==1)throw new Error("not saved");}
  else {const {data}=await client.mutate({mutation:INSERT,variables:{...form,price:form.is_paid?Number(form.price):0,user_id:user.user?.id,recipe_ingredients:{data:cleanIngredients.map(ingredient=>({ingredient}))},recipe_steps:{data:cleanSteps.map((step_description,i)=>({step_description,step_no:i+1}))}}});id.value=data.insert_recipe.returning[0].id;}
  persisted=true;
  if(files.value.length && canUpload.value){const images=await Promise.all(files.value.map(async(file,i)=>({image_name:file.name,image_type:file.type,image_base64str:await photoData(file),is_thumbnail:i===0&&!existingImages.value.length})));await client.mutate({mutation:UPLOAD,variables:{input:{recipe_id:id.value,recipe_images:images}}});}
  await navigateTo("/recipes/"+id.value);
 }catch{error.value=persisted?"Your recipe is saved, but the photos didn't arrive. Try adding them again.":"We couldn't save your recipe. Your changes are still here—please try again.";}
 finally{saving.value=false;}
}
async function removePhoto(image:any){
 if(!confirm("Remove this photo from your recipe?"))return;
 try{await client.mutate({mutation:gql("mutation RemovePhoto($id:uuid!){delete_recipe_image_by_pk(id:$id){id}}"),variables:{id:image.id}});existingImages.value=existingImages.value.filter(x=>x.id!==image.id);}catch{error.value="We couldn't remove the photo. Please try again.";}
}
</script>
<template>
 <section v-if="allowed" class="editor-page">
  <header class="page-heading"><NuxtLink to="/myrecipes" class="text-link text-sm mb-4"><Icon name="lucide:arrow-left" size="16" />Your recipes</NuxtLink><h1>{{ recipeId ? "A little more you." : "Share something good." }}</h1><p>{{ recipeId ? "Keep the recipe, photos and little details just right." : "A family favorite, a new discovery, or your weeknight go-to. Make room for it here." }}</p></header>
  <form @submit.prevent="save" :aria-busy="saving">
   <div class="editor-grid"><div class="editor-main">
    <section class="editor-section"><h2>The recipe.</h2><div class="field-group"><label for="recipe-title">What are we making?</label><input id="recipe-title" v-model="form.title" class="input" required minlength="5" maxlength="255" placeholder="Give your recipe a name"></div><div class="field-group"><label for="recipe-description">A little about it</label><textarea id="recipe-description" v-model="form.description" class="textarea" rows="4" required minlength="10" placeholder="What makes this one worth cooking?" /></div><div class="grid sm:grid-cols-2 gap-5"><div class="field-group"><label for="recipe-category">Category</label><select id="recipe-category" v-model.number="form.category_id" class="select" required><option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category_name }}</option></select></div><div class="field-group"><label for="recipe-time">Time in the kitchen (minutes)</label><input id="recipe-time" v-model.number="form.prep_time" class="input" type="number" min="1" max="1440" required></div></div></section>
    <section class="editor-section"><h2>What goes in.</h2><p>Include amounts, so another cook can follow along.</p><div v-for="(_,i) in ingredients" :key="i" class="editor-line"><label :for="'ingredient-'+i" class="sr-only">Ingredient {{ i+1 }}</label><input :id="'ingredient-'+i" v-model="ingredients[i]" class="input" placeholder="For example: 1 cup red lentils" required><button class="icon-button" type="button" :aria-label="'Remove ingredient '+(i+1)" :disabled="ingredients.length===1" @click="ingredients.splice(i,1)"><Icon name="lucide:x" size="18" /></button></div><button class="btn btn-outline" type="button" @click="ingredients.push('')"><Icon name="lucide:plus" size="17" />Add an ingredient</button></section>
    <section class="editor-section"><h2>How it comes together.</h2><p>Keep each step clear and kind. One thing at a time.</p><div v-for="(_,i) in steps" :key="i" class="editor-line items-start"><span class="step-number pt-3" aria-hidden="true">{{ i+1 }}.</span><label :for="'step-'+i" class="sr-only">Cooking step {{ i+1 }}</label><textarea :id="'step-'+i" v-model="steps[i]" class="textarea" rows="3" required placeholder="Tell us what to do next." /><button class="icon-button" type="button" :aria-label="'Remove step '+(i+1)" :disabled="steps.length===1" @click="steps.splice(i,1)"><Icon name="lucide:x" size="18" /></button></div><button class="btn btn-outline" type="button" @click="steps.push('')"><Icon name="lucide:plus" size="17" />Add a step</button></section>
   </div><aside class="editor-aside">
    <section class="editor-section photo-upload"><h2>A taste of what's coming.</h2><p>A real photo of your cooking makes all the difference.</p><div v-if="existingImages.length" class="editor-photo-grid"><div v-for="image in existingImages" :key="image.id"><img :src="image.img_url" alt="Your recipe photo"><button type="button" class="text-sm underline mt-2" @click="removePhoto(image)">Remove photo</button></div></div><div v-if="previews.length" class="editor-photo-grid"><img v-for="src in previews" :key="src" :src="src" alt="Selected recipe photo preview"></div><label class="upload-zone" for="recipe-photos"><Icon name="lucide:image-plus" size="28" /><strong>Add your food photos</strong><span>JPG, PNG or WebP · up to 5 photos · 10 MB each</span><input id="recipe-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple :disabled="!canUpload || saving" aria-describedby="photo-help" @change="pickPhotos"></label><p id="photo-help" class="font-small-text">{{ canUpload ? "Your first photo becomes the recipe cover." : "Photo uploads aren't available yet. You can still save the recipe and add photos later." }}</p></section>
    <section class="editor-section"><h2>Made to share.</h2><label class="flex items-start gap-3"><input v-model="form.is_paid" class="checkbox" type="checkbox"><span>Make this a paid recipe</span></label><div v-if="form.is_paid" class="field-group mt-5"><label for="recipe-price">Price (ETB)</label><input id="recipe-price" v-model.number="form.price" class="input" type="number" min="0.01" step="0.01" required><p v-if="!canPay" class="font-small-text">Checkout isn't available yet. Paid recipes stay locked to other cooks until it's connected.</p></div><p v-else class="font-small-text mt-4">Everyone can read the ingredients and steps of a free recipe.</p></section>
   </aside></div>
   <div class="editor-save"><p v-if="error" class="form-error" role="alert">{{ error }}</p><div class="flex flex-wrap items-center gap-4"><button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? "Saving your recipe…" : recipeId ? "Save your changes" : "Publish your recipe" }}<Icon v-if="!saving" name="lucide:arrow-up-right" size="17" /></button><NuxtLink to="/myrecipes" class="text-link text-sm">Back to your recipes</NuxtLink></div></div>
  </form>
 </section>
 <div v-else class="empty-state my-10"><h1 class="font-header-2">This is another cook's kitchen.</h1><p>You can edit the recipes you created.</p><NuxtLink to="/myrecipes" class="btn btn-primary">Your recipes</NuxtLink></div>
</template>
