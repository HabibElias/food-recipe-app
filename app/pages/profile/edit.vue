<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true });

const userStore = useUserStore();
const toast = useToast();

const form = reactive({
  FirstName: userStore.user?.FirstName || '',
  LastName: userStore.user?.LastName || '',
  bio: (userStore.user as any)?.bio || '',
});

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(userStore.user?.avatar_url || null);

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  selectedFile.value = input.files[0];
  previewUrl.value = URL.createObjectURL(selectedFile.value);
}

function save() {
  // optimistic local update
  if (!userStore.user) return;
  userStore.user.FirstName = form.FirstName;
  userStore.user.LastName = form.LastName;
  (userStore.user as any).bio = form.bio;

  if (selectedFile.value) {
    // In absence of a server mutation for uploading avatar, we set a local preview URL.
    userStore.user.avatar_url = previewUrl.value as string;
  }

  toast.success('Profile updated (locally).');

  // TODO: call server mutation to persist profile changes and upload avatar.
  navigateTo('/profile');
}

function cancel() {
  navigateTo('/profile');
}
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-3xl mx-auto bg-base-100 border rounded-3xl p-8">
      <h2 class="font-header-2 mb-4">Edit profile</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div class="md:col-span-1">
          <div class="w-40 h-40 rounded-full overflow-hidden bg-base-200">
            <img v-if="previewUrl" :src="previewUrl" alt="avatar preview" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-base-content/50">No image</div>
          </div>
          <input class="mt-3" type="file" accept="image/*" @change="onFileChange" />
        </div>

        <div class="md:col-span-2">
          <label class="block mb-2">First name</label>
          <input v-model="form.FirstName" class="input input-bordered w-full mb-4" />

          <label class="block mb-2">Last name</label>
          <input v-model="form.LastName" class="input input-bordered w-full mb-4" />

          <label class="block mb-2">Bio</label>
          <textarea v-model="form.bio" rows="4" class="textarea textarea-bordered w-full mb-4"></textarea>

          <div class="flex gap-2">
            <button class="btn btn-primary" @click="save">Save</button>
            <button class="btn btn-ghost" @click="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
