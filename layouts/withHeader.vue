<template>
    <div id="app" class="flex-container main-container">
        <Header></Header>
        <Nuxt class="container-fluid" />
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import Header from "../components/header/Header";
    export default {
        components: {Header},
    }
</script>