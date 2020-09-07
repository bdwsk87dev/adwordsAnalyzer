<template>
  <div id="app" class="app-container">
    <Nuxt />
  </div>
</template>
<script >
  import {mapGetters} from "vuex";
  import Header from "../components/header/Header";
  export  default {
    data(){
      return{
      }
    },
    components:{
      Header
    }
  }
</script>