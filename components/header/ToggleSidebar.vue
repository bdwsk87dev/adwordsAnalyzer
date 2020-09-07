<template>
    <button type="button" id="sidebarCollapse" class="btn btn-info toggleSideBar" @click="toggleSideBar">
        <font-awesome-icon icon="bars" />
    </button>
</template>

<script>
    export default {
        name: "ToggleSidebar",
        data(){
            return{
                isSideBar: false
            }
        },
        methods:{
            toggleSideBar(){
                this.isSideBar = !this.isSideBar;
                this.$store.dispatch('localStorage/toggleSideBar',this.isSideBar);
            }
        }
    }
</script>

<style scoped>

</style>