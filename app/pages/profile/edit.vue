<script setup lang="ts">
import UPLOAD from "~~/server/_mutations/UploadUserImage.gql";
import ME from "~~/server/_queries/GetMe.gql";
definePageMeta({ middleware: ["auth"], requiresAuth: true });
useSeoMeta({ title: "Edit your profile · Bowlup" });
const store = useUserStore(); const client = useApolloClient().client;
const form = reactive({ FirstName: store.user?.FirstName || "", LastName: store.user?.LastName || "", bio: store.user?.bio || "" });
const saving=ref(false); const error=ref(""); const canUpload=ref(false); const file=ref<File|null>(null); const preview=ref("");
try { const {data}=await client.query({query:gql("{__schema{mutationType{fields{name}}}}")}); canUpload.value=data.__schema.mutationType.fields.some((x:any)=>x.name==="uploadUserImage"); } catch { /* Text updates remain available. */ }
function pick(event:Event) {
 const selected=(event.target as HTMLInputElement).files?.[0]; if(!selected)return;
 if(selected.size>10*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(selected.type)){error.value="Choose a JPG, PNG or WebP photo under 10 MB.";return;}
 if(preview.value)URL.revokeObjectURL(preview.value); file.value=selected;preview.value=URL.createObjectURL(selected);error.value="";
}
onBeforeUnmount(()=>{if(preview.value)URL.revokeObjectURL(preview.value);});
async function save() {
 saving.value=true;error.value="";let textSaved=false;
 try {
  const {data}=await client.mutate({mutation:gql("mutation SaveProfile($id:uuid!,$changes:user_set_input!){update_user(where:{id:{_eq:$id}},_set:$changes){affected_rows returning{FirstName LastName bio}}}"),variables:{id:store.user?.id,changes:form}});
  if(data.update_user.affected_rows!==1)throw new Error("Not saved");
  if(store.user)Object.assign(store.user,data.update_user.returning[0]);textSaved=true;
  if(file.value && canUpload.value){
   const image=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=reject;reader.readAsDataURL(file.value!);});
   await client.mutate({mutation:UPLOAD,variables:{input:{image:{image_name:file.value.name,image_type:file.value.type,image_base64str:image}}}});
   const refreshed=await client.mutate({mutation:ME,variables:{token:store.token}});store.user=refreshed.data.Me.user;
  }
  await navigateTo("/profile");
 }catch{error.value=textSaved?"Your profile details are saved, but the photo didn't upload. Please try the photo again.":"We couldn't save your profile. Your changes are still here. Please try again.";}
 finally{saving.value=false;}
}
</script>
<template>
 <section class="profile-page"><header class="page-heading"><NuxtLink to="/profile" class="text-link mb-4"><Icon name="lucide:arrow-left" size="16" />Your profile</NuxtLink><h1>Make yourself at home.</h1><p>A few details to help other cooks get to know you.</p></header>
  <form class="auth-form max-w-xl" @submit.prevent="save" :aria-busy="saving"><div class="profile-intro"><img v-if="preview || store.user?.avatar_url" :src="preview || store.user?.avatar_url || ''" class="profile-avatar" alt="Your profile photo"><span v-else class="profile-avatar" aria-hidden="true">{{ form.FirstName.slice(0,1).toUpperCase() || 'Y' }}</span><div><label for="profile-photo">Profile photo</label><input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" :disabled="!canUpload || saving" @change="pick"><p class="text-sm text-muted mt-2">{{ canUpload ? 'JPG, PNG or WebP, under 10 MB.' : 'Photo uploads are not available yet. You can save your profile details below.' }}</p></div></div>
   <div class="grid sm:grid-cols-2 gap-5"><div><label for="profile-first">First name</label><input id="profile-first" v-model="form.FirstName" class="input" required minlength="2" maxlength="60" autocomplete="given-name"></div><div><label for="profile-last">Last name</label><input id="profile-last" v-model="form.LastName" class="input" required minlength="2" maxlength="60" autocomplete="family-name"></div></div><div><label for="profile-bio">A little about your kitchen</label><textarea id="profile-bio" v-model="form.bio" class="textarea" rows="4" maxlength="600" placeholder="Your favorite food, the dish you're learning, or what brings you here." /></div><p v-if="error" class="form-error" role="alert">{{ error }}</p><div class="flex gap-3"><button class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save profile' }}</button><NuxtLink to="/profile" class="btn btn-outline">Cancel</NuxtLink></div>
  </form>
 </section>
</template>
