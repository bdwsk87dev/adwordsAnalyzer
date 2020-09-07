<template>
    <div class="auth-btn-container">
        <b-button class="btn-submit signin" @click="loginSubmit" v-if="this.isLoad">Авторизироваться через Google</b-button>
        <p class="error-sign" v-if="this.isError === true">Кажется вы выбрали не тот аккаунт.<br> Пожалуйста, авторизируйтесь под другим аккаунтом</p>
        <Loader :isLoad="this.isLoad"></Loader>
    </div>
</template>

<script>
    import AdwordsNetwork from "../../adwords-network";
    import Loader from "../loader/Loader";
    const AdwordsNetworks = new AdwordsNetwork();
    export default {
        name: "AuthButton",
        components: {Loader},
        data(){
            return({
                isLoad: true,
                isError: false,
                loginObj:{
                    isLoad: true,
                    emailUser: null,
                    clients: [],
                    gaAccounts: []
                },
            })
        },
        methods:{
            loginSubmit(){
                this.isLoad = false;
                localStorage.isError = false;
                console.log(this.isError)
                this.$gAuth.signIn()
                    .then(GoogleUser => {
                        let googleProfile = GoogleUser.getBasicProfile(),
                            googleAuth = GoogleUser.getAuthResponse();
                        this.loginObj.emailUser =  googleProfile.getEmail();
                        localStorage.id = GoogleUser.getId();
                        console.log(GoogleUser.getAuthResponse());
                        // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
                        let nameUser = googleProfile.getName(),
                            accessToken = googleAuth.access_token ,
                            idToken = googleAuth.id_token;
                        AdwordsNetworks.signIn(localStorage.id,this.loginObj.emailUser,nameUser,accessToken,idToken).then((response)=>{
                            for(let i = 0;i<response.data.length;i++){
                                this.loginObj.clients.push(response.data[i].customer_client.client_customer.replace('customers/',''));
                            }
                            AdwordsNetworks
                                .getAccounts()
                            .then((rez)=>{
                                for(let i = 0;i<rez.data.length;i++) {
                                    this.loginObj.gaAccounts.push(rez.data[i]);
                                }
                                console.log(this.loginObj.gaAccounts);
                                this.loginObj.isLoginIn = true;
                                this.isLoad = true;
                                this.$store.dispatch('localStorage/LoginIn',this.loginObj);
                            }).catch((err)=>{
                                console.log(err);
                                this.loginObj.isLoginIn =  false;
                                this.loginObj.clients = [];
                                this.loginObj.emailUser =  null;
                                this.isLoad = false;
                                this.$store.dispatch('localStorage/LoginIn',this.loginObj);
                            })
                        }).catch((error)=>{
                            console.log(error);
                            this.isError = true;
                            this.isLoad = true;
                            this.loginObj.isLoginIn =  false;
                            this.loginObj.clients = [];
                            this.loginObj.emailUser =  null;
                            this.$store.dispatch('localStorage/LoginIn',this.loginObj);
                        });
                    });
            },
        }
    }
</script>

<style scoped>

</style>