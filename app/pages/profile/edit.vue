<script setup lang="ts">
import UPLOAD_USER_IMAGE_MUTATION from "~~/server/_mutations/UploadUserImage.gql";

definePageMeta({ middleware: ["auth"], requiresAuth: true });

const userStore = useUserStore();
const toast = useToast();

const form = reactive({
  FirstName: userStore.user?.FirstName || "",
  LastName: userStore.user?.LastName || "",
  bio: (userStore.user as any)?.bio || "",
});

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(userStore.user?.avatar_url || null);

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files[0])
    return;
  selectedFile.value = input.files[0];
  previewUrl.value = URL.createObjectURL(selectedFile.value);
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

async function save() {
  if (!userStore.user)
    return;

  // Update local fields optimistically
  userStore.user.FirstName = form.FirstName;
  userStore.user.LastName = form.LastName;
  (userStore.user as any).bio = form.bio;

  // If a file was selected, upload via Hasura action
  if (selectedFile.value && import.meta.client) {
    try {
      const client = useApolloClient().client;
      const base64 = await convertFileToBase64(selectedFile.value);

      await client.mutate({
        mutation: UPLOAD_USER_IMAGE_MUTATION,
        variables: {
          input: {
            user_id: userStore.user.id,
            Image: {
              image_name: selectedFile.value.name,
              image_type: selectedFile.value.type,
              image_base64str: base64,
            },
          },
        },
      });

      // Optimistically update avatar_url with preview
      if (previewUrl.value) {
        userStore.user.avatar_url = previewUrl.value;
      }

      toast.success({ message: "Profile updated." });
    }
    catch (err: any) {
      console.error("Failed to upload user image", err);
      toast.error({ message: err?.message || "Failed to upload image" });
      // still navigate and keep local optimistic fields
    }
  }
  else {
    // no file selected — just save fields locally
    toast.success({ message: "Profile updated." });
  }

  navigateTo("/profile");
}

function cancel() {
  navigateTo("/profile");
}
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-3xl mx-auto bg-base-100 border rounded-3xl p-8">
      <h2 class="font-header-2 mb-4">
        Edit profile
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div class="md:col-span-1">
          <div class="w-40 h-40 rounded-full overflow-hidden bg-base-200">
            <img v-if="previewUrl" :src="previewUrl" alt="avatar preview" class="w-full h-full object-cover">
            <div v-else class="w-full h-full flex items-center justify-center text-base-content/50">
              No image
            </div>
          </div>
          <input class="mt-3 file-input" type="file" accept="image/*" @change="onFileChange">
        </div>

        <div class="md:col-span-2">
          <label class="block mb-2">First name</label>
          <input v-model="form.FirstName" class="input input-bordered w-full mb-4">

          <label class="block mb-2">Last name</label>
          <input v-model="form.LastName" class="input input-bordered w-full mb-4">

          <label class="block mb-2">Bio</label>
          <textarea v-model="form.bio" rows="4" class="textarea textarea-bordered w-full mb-4" />

          <div class="flex gap-2">
            <button class="btn btn-primary" @click="save">
              Save
            </button>
            <button class="btn btn-ghost" @click="cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
