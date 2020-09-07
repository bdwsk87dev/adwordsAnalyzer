<template>
  <div class="signin-container">
    <AuthButton/>
    <GoogleAccounts/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import {mapGetters} from "vuex";
  import AuthButton from "../components/sign-in/AuthButton";
  import GoogleAccounts from "../components/sign-in/GoogleAccounts";
  export default {
    name: 'SignIn',
    components: {GoogleAccounts, AuthButton}, 
  }
</script>