<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod";
import { Form, useForm } from "vee-validate";
import z from "zod";

definePageMeta({
  middleware: [() => {
    const userStore = useUserStore();

    return userStore.isLoggedIn ? navigateTo("/") : true;
  }],
});

const loginSchema = toTypedSchema(z.object({
  email: z.email({ message: "Field required" }),
  password: z.string({ message: "Field required" }).min(6, { message: "Minimum of 6 characters needed for a password" }),
  first_name: z.string({ message: "Field required" }).min(3, { message: "Minimum of 3 characters needed for a First Name" }),
  last_name: z.string({ message: "Field required" }).min(3, { message: "Minimum of 3 characters needed for a Last Name" }),
  username: z.string({ message: "Field required" }).min(5, { message: "Minimum of 5 characters needed for a username" }),
}));

const { handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  },
});

const userStore = useUserStore();

const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");
const [first_name, firstNameProps] = defineField("first_name");
const [last_name, lastNameProps] = defineField("last_name");
const [username, userNameProps] = defineField("username");

const error = ref<string>("");
const loading = ref<boolean>(false);

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  error.value = "";
  try {
    await userStore.signup(values);
  }
  catch (err: any) {
    console.error(err.message);
    setErrors(JSON.parse(err.message));
    error.value = "Something went wrong";
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex justify-center items-center flex-col font-[poppins] min-h-[80vh] rounded-4xl border border-base-content/50">
    <div>Sign Up</div>
    <Form
      class="p-4 card bg-base-100 max-w-100"
      @submit="() => onSubmit()"
    >
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">First Name</span>
        </label>
        <input
          v-model="first_name"
          v-bind="firstNameProps"
          placeholder="Abebe"
          class="input w-full"
          :disabled="loading"
          :class="{ 'input-error': errors.first_name }"
        >
        <label v-if="errors.first_name" class="label">
          <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name }}</span>
        </label>
      </div>
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Last Name</span>
        </label>
        <input
          v-model="last_name"
          v-bind="lastNameProps"
          placeholder="MnBela"
          class="input w-full"
          :disabled="loading"
          :class="{ 'input-error': errors.last_name }"
        >
        <label v-if="errors.last_name" class="label">
          <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name }}</span>
        </label>
      </div>
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Username</span>
        </label>
        <input
          v-model="username"
          v-bind="userNameProps"
          placeholder="besobella"
          class="input w-full"
          :disabled="loading"
          :class="{ 'input-error': errors.username }"
        >
        <label v-if="errors.username" class="label">
          <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.username) ? errors.username[0] : errors.username }}</span>
        </label>
      </div>
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          v-model="email"
          v-bind="emailProps"
          placeholder="email@example.com"
          class="input w-full"
          :disabled="loading"
          :class="{ 'input-error': errors.email }"
        >
        <label v-if="errors.email" class="label">
          <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.email) ? errors.email[0] : errors.email }}</span>
        </label>
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          v-model="password"
          v-bind="passwordProps"
          :disabled="loading"
          type="password"
          placeholder="••••••••"
          class="input input-bordered w-full"
          :class="{ 'input-error': errors.password }"
        >
        <label v-if="errors.password" class="label">
          <span class="label-text-alt text-error text-xs">{{ Array.isArray(errors.password) ? errors.password[0] : errors.password }}</span>
        </label>
      </div>
      <nuxt-link class="link link-primary text-xs text-center mb-4" to="/auth/login">
        Already have an account? click here
      </nuxt-link>

      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full mb-4"
      >
        <span v-if="loading" class="loading loading-dots loading-md" />
        {{ loading ? "Signing up" : "Sign up" }}
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
