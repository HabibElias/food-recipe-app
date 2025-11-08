<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import INSERT_RECIPE_MUTATION from "~~/server/_mutations/InsertRecipeMutation.gql";
import { Form, useForm } from "vee-validate";
import { ref } from "vue";
import z from "zod";

const categories = ref<Category[]>([]);

const toast = useToast();

const GET_CATEGORIES = gql`
query {
  category {
    id
    category_name
    category_description
  }
}
`;

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

const stepsSchema = z.object(
  {
    step_no: z.number().min(1, { message: "Minimum number for step number is 1" }),
    step_description: z.string({ message: "Field required" }),
  },
);

const InsertRecipeSchema = toTypedSchema(z.object({
  title: z.string().min(5, { message: "Minimum of 5 characters are needed for title" }),
  description: z.string().min(10, { message: "Minimum of 10 characters are needed for description" }),
  steps: z.array(stepsSchema).min(1, { message: "At least one step is required" }),
  ingredients: z.array(z.object({ ingredient: z.string({ message: "Field is Required" }) })).min(1, { message: "At least one ingredient is required" }),
  category_id: z.number({ message: "category required" }),
  is_paid: z.boolean().default(false).optional(),
  price: z.number().default(0).optional(),
  prep_time: z.number({ message: "Must be greater than 5 minutes" }).min(5, { message: "Must be greater than 5 minutes" }),
}));

const { handleSubmit, errors, defineField, values, setValues, resetForm } = useForm({
  validationSchema: InsertRecipeSchema,
  initialValues: {
    title: "",
    description: "",
    steps: [],
    ingredients: [],
  },
});

const [title, titleProps] = defineField("title");
const [category_id, categoryIdProps] = defineField("category_id");
const [description, descriptionProps] = defineField("description");
const [is_paid, isPaidProps] = defineField("is_paid");
const [price, priceProps] = defineField("price");
const [prep_time, prepTimeProps] = defineField("prep_time");

const error = ref<string>("");
const loading = ref<boolean>(false);

// Ingredients and steps inputs handling
const newIngredient = ref("");
const newStepDescription = ref("");

function addIngredient() {
  const val = newIngredient.value.trim();
  if (!val) {
    return;
  }
  // push to form values
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

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  error.value = "";
  try {
    const client = useApolloClient().client;

    const variables = {
      title: values.title,
      category_id: values.category_id,
      description: values.description,
      is_paid: values.is_paid,
      prep_time: values.prep_time,
      price: values.price,
      recipe_ingredients: { data: values.ingredients },
      recipe_steps: { data: values.steps },
      user_id: useUserStore().user?.id,
    };

    console.log(variables);

    const returning = await client.mutate({
      mutation: INSERT_RECIPE_MUTATION,
      variables,
    });

    toast.success({ title: "Recipe Inserted", message: "Go to manage and add your images for the recipes" });
    console.log(returning);
    resetForm();
  }
  catch (err: any) {
    console.error(err.message);
    error.value = err.message || "Something went wrong";
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex justify-center items-center flex-col font-[poppins] min-h-[80vh] rounded-4xl border border-base-content/50 py-10">
    <div class="text-start font-header-3">
      Add Your Recipe
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
          min="1"
          max="10"
          title="Must be greater than 5 min"
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
          class="textarea w-full" placeholder="Description for the recipe"
        />
        <label v-if="errors.description" class="label">
          <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.description) ? errors.description[0] : errors.description }}</span>
        </label>
      </div>

      <!-- Ingredients input -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Ingredients</span>
        </label>
        <div class="flex gap-2">
          <input v-model="newIngredient" placeholder="e.g. 2 cups flour" class="input w-full" :disabled="loading">
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
          <li v-for="(ing, idx) in values.ingredients" :key="idx" class="flex items-center justify-between p-2 border rounded-md">
            <div class="text-sm">
              {{ ing.ingredient }}
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-ghost"
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
        <textarea v-model="newStepDescription" class="textarea w-full" placeholder="Describe this step..." :disabled="loading" />
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
          <li v-for="(s, idx) in values.steps" :key="idx" class="flex items-start justify-between gap-2">
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
          class="select w-full" required
          placeholder="Choose:"
        >
          <option disabled selected>
            Choose:
          </option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
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
            type="checkbox" class="checkbox checkbox-primary"
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
          max="10"
          title="Must be greater than 1"
        >
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full mb-4"
      >
        <span v-if="loading" class="loading loading-dots loading-md" />
        {{ loading ? "Adding" : "Add" }}
      </button>
      <div v-if="error" role="alert" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error! {{ error }}</span>
      </div>
    </Form>
  </div>
</template>
