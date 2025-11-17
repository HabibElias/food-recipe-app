<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import DELETE_RECIPE_IMAGE_MUTATION from "~~/server/_mutations/DeleteRecipeImageMutation.gql";
import UPDATE_RECIPE_IMAGE_THUMBNAIL_MUTATION from "~~/server/_mutations/UpdateRecipeImageThumbnailMutation.gql";
import UPDATE_RECIPE_INGREDIENTS_MUTATION from "~~/server/_mutations/UpdateRecipeIngredientsMutation.gql";
import UPDATE_RECIPE_MUTATION from "~~/server/_mutations/UpdateRecipeMutation.gql";
import UPDATE_RECIPE_STEPS_MUTATION from "~~/server/_mutations/UpdateRecipeStepsMutation.gql";
import UPLOAD_RECIPE_IMAGES_MUTATION from "~~/server/_mutations/UploadRecipeImagesMutation.gql";
import { Form, useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";

definePageMeta({
  middleware: ["auth"],
  requiresAuth: true,
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const recipeId = Number.parseInt(route.params.id as string);
const categories = ref<Category[]>([]);
const loading = ref<boolean>(true);
const error = ref<string>("");
const uploadingImages = ref(false);

const GET_CATEGORIES = gql`
query {
  category {
    id
    category_name
    category_description
  }
}
`;

const GET_RECIPE_QUERY = gql`
query GetRecipeForEdit($id: Int!) {
  recipe(where: { id: { _eq: $id } }) {
    id
    title
    description
    category_id
    is_paid
    prep_time
    price
    recipe_steps(order_by: { step_no: asc }) {
      id
      step_no
      step_description
    }
    recipe_ingredients {
      id
      ingredient
    }
    recipe_images {
      id
      img_url
      is_thumbnail
    }
  }
}
`;

// Load categories
try {
  const client = useApolloClient().client;
  const { data } = await client.query<{ category: Category[] }>({
    query: GET_CATEGORIES,
  });
  categories.value = data.category;
}
catch (err) {
  console.error(err);
}

const stepsSchema = z.object({
  step_no: z.number().min(1, { message: "Minimum number for step number is 1" }),
  step_description: z.string({ message: "Field required" }),
});

const UpdateRecipeSchema = toTypedSchema(z.object({
  title: z.string().min(5, { message: "Minimum of 5 characters are needed for title" }),
  description: z.string().min(10, { message: "Minimum of 10 characters are needed for description" }),
  steps: z.array(stepsSchema).min(1, { message: "At least one step is required" }),
  ingredients: z.array(z.object({ ingredient: z.string({ message: "Field is Required" }) })).min(1, { message: "At least one ingredient is required" }),
  category_id: z.number({ message: "category required" }),
  is_paid: z.boolean().default(false).optional(),
  price: z.number().default(0).optional(),
  prep_time: z.number({ message: "Must be greater than 5 minutes" }).min(5, { message: "Must be greater than 5 minutes" }),
}));

const { handleSubmit, errors, defineField, values, setValues } = useForm({
  validationSchema: UpdateRecipeSchema,
  initialValues: {
    title: "",
    description: "",
    steps: [],
    ingredients: [],
    category_id: undefined,
    is_paid: false,
    price: 0,
    prep_time: 5,
  },
});

const [title, titleProps] = defineField("title");
const [category_id, categoryIdProps] = defineField("category_id");
const [description, descriptionProps] = defineField("description");
const [is_paid, isPaidProps] = defineField("is_paid");
const [price, priceProps] = defineField("price");
const [prep_time, prepTimeProps] = defineField("prep_time");

// Ingredients and steps inputs handling
const newIngredient = ref("");
const newStepDescription = ref("");

// Images handling
const recipeImages = ref<{
  id: number;
  img_url: string;
  is_thumbnail: boolean;
}[]>([]);
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

function addIngredient() {
  const val = newIngredient.value.trim();
  if (!val) {
    return;
  }
  setValues({ ingredients: [...values.ingredients ?? [], { ingredient: val }] });
  newIngredient.value = "";
}

function removeIngredient(index: number) {
  setValues({ ingredients: [...values.ingredients?.filter((_, i) => i !== index) ?? []] });
}

function addSteps() {
  const desc = newStepDescription.value.trim();
  if (!desc) {
    return;
  }
  const nextNo = ((values as any).steps?.length ?? 0) + 1;
  setValues({ steps: [...values.steps ?? [], { step_no: nextNo, step_description: desc }] });
  newStepDescription.value = "";
}

function removeStep(index: number) {
  setValues({ steps: [...values.steps?.filter((_, i) => i !== index) ?? []] });
  // re-number steps
  setValues({ steps: [...values.steps?.map((s, i) => ({ ...s, step_no: i + 1 })) ?? []] });
}

function handleImageSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        imageFiles.value.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imagePreviews.value.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function removeImagePreview(index: number) {
  imageFiles.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
}

async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result || typeof result !== "string") {
        reject(new Error("Failed to read file as data URL"));
        return;
      }
      const parts = result.split(",");
      const base64String = parts[1] ?? "";
      if (!base64String) {
        reject(new Error("Invalid data URL format"));
        return;
      }
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function deleteImage(imageId: number) {
  try {
    const client = useApolloClient().client;
    await client.mutate({
      mutation: DELETE_RECIPE_IMAGE_MUTATION,
      variables: { id: imageId },
    });
    recipeImages.value = recipeImages.value.filter(img => img.id !== imageId);
    toast.success({ title: "Image Deleted", message: "Image has been successfully deleted" });
    await loadRecipe();
  }
  catch (err: any) {
    console.error(err);
    toast.error({ title: "Error", message: err.message || "Failed to delete image" });
  }
}

async function setThumbnail(imageId: number) {
  try {
    const client = useApolloClient().client;
    await client.mutate({
      mutation: UPDATE_RECIPE_IMAGE_THUMBNAIL_MUTATION,
      variables: {
        recipe_id: recipeId,
        image_id: imageId,
      },
    });
    recipeImages.value = recipeImages.value.map(img => ({
      ...img,
      is_thumbnail: img.id === imageId,
    }));
    toast.success({ title: "Thumbnail Updated", message: "Thumbnail has been set" });
    await loadRecipe();
  }
  catch (err: any) {
    console.error(err);
    toast.error({ title: "Error", message: err.message || "Failed to update thumbnail" });
  }
}

async function loadRecipe() {
  loading.value = true;
  try {
    const client = useApolloClient().client;
    const { data } = await client.query<{
      recipe: {
        id: number;
        title: string;
        description: string;
        category_id: number;
        is_paid: boolean;
        prep_time: number;
        price: number | null;
        recipe_steps: {
          id: string;
          step_no: number;
          step_description: string;
        }[];
        recipe_ingredients: {
          id: number;
          ingredient: string;
        }[];
        recipe_images: {
          id: number;
          img_url: string;
          is_thumbnail: boolean;
        }[];
      }[];
    }>({
      query: GET_RECIPE_QUERY,
      variables: { id: recipeId },
    });

    if (data.recipe.length === 0) {
      error.value = "Recipe not found";
      return;
    }

    const recipe = data.recipe[0];

    // Populate form with existing data
    setValues({
      title: recipe?.title,
      description: recipe?.description,
      category_id: recipe?.category_id,
      is_paid: recipe?.is_paid,
      prep_time: recipe?.prep_time,
      price: recipe?.price ?? 0,
      steps: recipe?.recipe_steps.map(s => ({
        step_no: s.step_no,
        step_description: s.step_description,
      })),
      ingredients: recipe?.recipe_ingredients.map(i => ({
        ingredient: i.ingredient,
      })),
    });

    recipeImages.value = recipe?.recipe_images || [];
  }
  catch (err: any) {
    console.error(err);
    error.value = err.message || "Failed to load recipe";
  }
  finally {
    loading.value = false;
  }
}

// Load recipe data
onMounted(async () => {
  await loadRecipe();
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  error.value = "";
  try {
    const client = useApolloClient().client;

    // Update recipe
    await client.mutate({
      mutation: UPDATE_RECIPE_MUTATION,
      variables: {
        id: recipeId,
        title: values.title,
        category_id: values.category_id,
        description: values.description,
        is_paid: values.is_paid,
        prep_time: values.prep_time,
        price: values.price,
      },
    });

    // Update ingredients
    await client.mutate({
      mutation: UPDATE_RECIPE_INGREDIENTS_MUTATION,
      variables: {
        recipe_id: recipeId,
        ingredients: values.ingredients.map(ing => ({
          recipe_id: recipeId,
          ingredient: ing.ingredient,
        })),
      },
    });

    // Update steps
    await client.mutate({
      mutation: UPDATE_RECIPE_STEPS_MUTATION,
      variables: {
        recipe_id: recipeId,
        steps: values.steps.map(step => ({
          recipe_id: recipeId,
          step_no: step.step_no,
          step_description: step.step_description,
        })),
      },
    });

    // Upload new images (batch via Hasura action)
    if (imageFiles.value.length > 0) {
      uploadingImages.value = true;
      try {
        // determine if there is already a thumbnail among existing images
        const hasThumbnail = recipeImages.value.some(img => img.is_thumbnail);

        const recipeImagesPayload = await Promise.all(imageFiles.value.map(async (file, index) => ({
          image_name: file.name,
          image_type: file.type,
          image_base64str: await convertFileToBase64(file),
          is_thumbnail: !hasThumbnail && index === 0,
        })));

        await client.mutate({
          mutation: UPLOAD_RECIPE_IMAGES_MUTATION,
          variables: {
            input: {
              recipe_id: recipeId,
              recipe_images: recipeImagesPayload,
            },
          },
        });

        // clear selected files and previews and reload images
        imageFiles.value = [];
        imagePreviews.value = [];
        await loadRecipe();
      }
      catch (imageErr: any) {
        console.error("Image upload error:", imageErr);
        toast.error({ title: "Image Upload Error", message: imageErr.message || "Failed to upload images" });
      }
      finally {
        uploadingImages.value = false;
      }
    }

    toast.success({ title: "Recipe Updated", message: "Your recipe has been successfully updated" });
    router.push("/myrecipes/manage");
  }
  catch (err: any) {
    console.error(err);
    error.value = err.message || "Something went wrong";
    toast.error({ title: "Error", message: error.value });
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex justify-center items-center flex-col font-[poppins] min-h-[80vh] rounded-4xl border border-base-content/50 py-10">
    <div v-if="loading && !values.title" class="flex flex-col items-center justify-center">
      <span class="loading loading-dots loading-xl" />
      <p class="mt-4">
        Loading recipe...
      </p>
    </div>

    <div v-else-if="error && !values.title" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-else>
      <div class="text-start font-header-3 mb-6">
        Edit Your Recipe
      </div>
      <Form
        class="p-4 card bg-base-100 w-sm md:w-md lg:w-lg"
        @submit="() => onSubmit()"
      >
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input
            v-model="title"
            v-bind="titleProps"
            placeholder="Chocolate Cake"
            class="input w-full"
            :disabled="loading"
            :class="{ 'input-error': errors.title }"
          >
          <label v-if="errors.title" class="label">
            <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.title) ? errors.title[0] : errors.title }}</span>
          </label>
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Preparation Time</span>
          </label>
          <input
            v-model="prep_time"
            v-bind="prepTimeProps"
            type="number"
            class="input w-full"
            required
            placeholder="Type the prep time in minutes"
            min="5"
            :disabled="loading"
          >
          <label v-if="errors.prep_time" class="label">
            <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.prep_time) ? errors.prep_time[0] : errors.prep_time }}</span>
          </label>
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Description</span>
          </label>
          <textarea
            v-model="description"
            v-bind="descriptionProps"
            class="textarea w-full"
            placeholder="Description for the recipe"
            :disabled="loading"
          />
          <label v-if="errors.description" class="label">
            <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.description) ? errors.description[0] : errors.description }}</span>
          </label>
        </div>

        <!-- Images Section -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Recipe Images</span>
          </label>

          <!-- Existing Images -->
          <div v-if="recipeImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div
              v-for="(image, index) in recipeImages"
              :key="image.id"
              class="relative group"
            >
              <img
                :src="image.img_url"
                :alt="`Recipe image ${index + 1}`"
                class="w-full h-32 object-cover rounded-lg border-2"
                :class="{ 'border-primary': image.is_thumbnail }"
              >
              <div v-if="image.is_thumbnail" class="absolute top-2 left-2 badge badge-primary badge-sm">
                Thumbnail
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  :disabled="loading || image.is_thumbnail"
                  @click="setThumbnail(image.id)"
                >
                  <icon name="lucide:star" />
                  Set Thumbnail
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-error"
                  :disabled="loading"
                  @click="deleteImage(image.id)"
                >
                  <icon name="lucide:trash-2" />
                </button>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="space-y-2">
            <input
              type="file"
              accept="image/*"
              multiple
              class="file-input file-input-bordered w-full"
              :disabled="loading || uploadingImages"
              @change="handleImageSelect"
            >
            <p class="text-xs text-base-content/70">
              You can select multiple images at once
            </p>
          </div>

          <!-- Image Previews -->
          <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div
              v-for="(preview, index) in imagePreviews"
              :key="index"
              class="relative"
            >
              <img
                :src="preview"
                :alt="`Preview ${index + 1}`"
                class="w-full h-32 object-cover rounded-lg border"
              >
              <button
                type="button"
                class="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                :disabled="loading || uploadingImages"
                @click="removeImagePreview(index)"
              >
                <icon name="lucide:x" />
              </button>
            </div>
          </div>
        </div>

        <!-- Ingredients input -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Ingredients</span>
          </label>
          <div class="flex gap-2">
            <input
              v-model="newIngredient"
              placeholder="e.g. 2 cups flour"
              class="input w-full"
              :disabled="loading"
            >
            <button
              type="button"
              class="btn btn-outline"
              :disabled="loading || !newIngredient"
              @click="addIngredient"
            >
              Add
            </button>
          </div>
          <label v-if="errors.ingredients" class="label">
            <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.ingredients) ? errors.ingredients[0] : errors.ingredients }}</span>
          </label>

          <ul class="mt-2 space-y-2">
            <li
              v-for="(ing, idx) in values.ingredients"
              :key="idx"
              class="flex items-center justify-between p-2 border rounded-md"
            >
              <div class="text-sm">
                {{ ing.ingredient }}
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="btn btn-sm btn-ghost"
                  :disabled="loading"
                  @click="removeIngredient(idx)"
                >
                  Remove
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Steps input -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Steps</span>
          </label>
          <textarea
            v-model="newStepDescription"
            class="textarea w-full"
            placeholder="Describe this step..."
            :disabled="loading"
          />
          <div class="mt-2 flex justify-end">
            <button
              type="button"
              class="btn btn-outline btn-sm"
              :disabled="loading || !newStepDescription"
              @click="addSteps"
            >
              Add step
            </button>
          </div>
          <label v-if="errors.steps" class="label">
            <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.steps) ? errors.steps[0] : errors.steps }}</span>
          </label>

          <ol class="mt-2 list-decimal space-y-2">
            <li
              v-for="(s, idx) in values.steps"
              :key="idx"
              class="flex items-start justify-between gap-2"
            >
              <div>
                <div class="font-paragraph-2">
                  Step {{ s.step_no }}
                </div>
                <div class="font-small-text">
                  {{ s.step_description }}
                </div>
              </div>
              <div class="self-start">
                <button
                  type="button"
                  class="btn btn-sm btn-ghost"
                  :disabled="loading"
                  @click="removeStep(idx)"
                >
                  Remove
                </button>
              </div>
            </li>
          </ol>
        </div>

        <div class="mb-4">
          <label class="label">
            <span class="label-text">Category</span>
          </label>
          <select
            v-model="category_id"
            v-bind="categoryIdProps"
            class="select w-full"
            required
            placeholder="Choose:"
            :disabled="loading"
          >
            <option disabled :selected="!category_id">
              Choose:
            </option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.category_name }}
            </option>
          </select>
          <label v-if="errors.category_id" class="label">
            <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.category_id) ? errors.category_id[0] : errors.category_id }}</span>
          </label>
        </div>

        <div class="flex flex-col mb-4">
          <label class="label">
            <span class="label-text">Paid</span>
          </label>
          <div class="flex items-center text-xs gap-2 mb-4">
            <input
              v-model="is_paid"
              v-bind="isPaidProps"
              type="checkbox"
              class="checkbox checkbox-primary"
              :disabled="loading"
            >
            <span>
              if your recipe is going to need payment
            </span>
          </div>
          <p class="font-small-text">
            Optional
          </p>
        </div>

        <div v-if="values.is_paid" class="mb-4">
          <input
            v-model="price"
            v-bind="priceProps"
            type="number"
            class="input w-full"
            required
            placeholder="Type the price for your recipe"
            min="1"
            :disabled="loading"
          >
        </div>

        <button
          type="submit"
          :disabled="loading || uploadingImages"
          class="btn btn-primary w-full mb-4"
        >
          <span v-if="loading || uploadingImages" class="loading loading-dots loading-md" />
          {{ loading || uploadingImages ? "Updating" : "Update Recipe" }}
        </button>
        <div v-if="error" role="alert" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error! {{ error }}</span>
        </div>
      </Form>
    </div>
  </div>
</template>
