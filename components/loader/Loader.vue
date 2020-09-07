<template>
    <div class="loader" v-if="!isLoad">
        <div class="loadingio-spinner-double-ring-03gvfbyaygnj"><div class="ldio-w1l6w4jkuc">
            <div></div>
            <div></div>
            <div><div></div></div>
            <div><div></div></div>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Loader",
        data(){
            return{

            }
        },
        props:[
            'isLoad'
        ],
    }
</script>

<style scoped>

</style>