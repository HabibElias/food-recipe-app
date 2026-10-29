<script setup lang="ts">
const props=defineProps<{signup?:boolean}>();
const user=useUserStore();
const values=reactive({email:"",password:"",first_name:"",last_name:"",username:""});
const busy=ref(false);const error=ref("");const showPassword=ref(false);
async function submit(){
 error.value="";busy.value=true;
 try { if(props.signup) await user.signup(values);else await user.login(values.email,values.password); }
 catch { error.value=props.signup ? "We couldn't create your account. Check your details, or try a different email and username." : "We couldn't sign you in. Check your email and password, then try again."; }
 finally {busy.value=false;}
}
useSeoMeta({title:()=> (props.signup ? "Join the kitchen" : "Sign in") + " — Bowlup"});
</script>
<template><section class="auth-page">
 <h1>{{ signup ? "Make yourself at home." : "Back for seconds?" }}</h1><p>{{ signup ? "A place for your favorites, your cooking, and a little inspiration." : "Sign in to find your saved recipes and share what's cooking." }}</p>
 <form class="auth-form" :aria-busy="busy" @submit.prevent="submit">
  <template v-if="signup"><div class="grid grid-cols-2 gap-4"><div><label for="first-name">First name</label><input id="first-name" v-model="values.first_name" class="input" autocomplete="given-name" required minlength="2" maxlength="100" :disabled="busy"></div><div><label for="last-name">Last name</label><input id="last-name" v-model="values.last_name" class="input" autocomplete="family-name" required minlength="2" maxlength="100" :disabled="busy"></div></div><div><label for="username">Your kitchen name</label><input id="username" v-model="values.username" class="input" autocomplete="username" required minlength="5" maxlength="50" aria-describedby="username-help" :disabled="busy"><p id="username-help" class="font-small-text mt-2 text-base-content/70">At least 5 characters. This is the name other cooks will see.</p></div></template>
  <div><label for="email">Email address</label><input id="email" v-model="values.email" class="input" type="email" autocomplete="email" required :disabled="busy"></div>
  <div><label for="password">Password</label><div class="relative"><input id="password" v-model="values.password" class="input pr-14" :type="showPassword ? 'text' : 'password'" :autocomplete="signup ? 'new-password' : 'current-password'" required minlength="6" maxlength="100" :aria-describedby="signup ? 'password-help' : undefined" :disabled="busy"><button type="button" class="icon-button absolute right-1 top-0" :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword" @click="showPassword=!showPassword"><Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" size="18" /></button></div><p v-if="signup" id="password-help" class="font-small-text mt-2 text-base-content/70">Use at least 6 characters.</p></div>
  <p v-if="error" role="alert" class="form-error">{{ error }}</p>
  <button type="submit" class="btn btn-primary w-full" :disabled="busy">{{ busy ? (signup ? "Making room for you…" : "Signing in…") : (signup ? "Join Bowlup" : "Sign in") }}<Icon v-if="!busy" name="lucide:arrow-right" size="17" /></button>
  <p class="auth-help">{{ signup ? "Already part of the kitchen?" : "New around here?" }} <NuxtLink :to="signup ? '/auth/login' : '/auth/sign-up'" class="underline">{{ signup ? "Sign in" : "Make an account" }}</NuxtLink></p>
 </form>
</section></template>
