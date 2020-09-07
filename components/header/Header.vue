<template>
       <div :class="{'sidebar':true,'active':this.getSideBar}">
               <div class="logo sidebar-padding">
                   <a href="https://optimozg.com/"><img src="../../assets/logo.png" alt="logo" class="logo-img"></a>
               </div>
               <div class="user-container sidebar-padding">
                   <div class="avatar">
                       <img src="../../assets/avatar.png" alt="avatar">
                   </div>
                   <div class="user-info">Email: <span class="user-info-text">{{getEmail}}</span></div>
                   <div class="user-info">Имя аккаунта: <span class="user-info-text">{{getClientName}}</span></div>
                   <div class="user-info">ID аккаунта: <span class="user-info-text">{{getClientID}}</span></div>
                   <div class="user-info">Аккаунт GA: <span class="user-info-text">{{getAccountId}}</span></div>
                   <div class="user-info">Профиль GA: <span class="user-info-text">{{getWebPropertyId}}</span></div>
                   <div class="user-info">Представление GA: <span class="user-info-text">{{getProfileId}}</span></div>
                   <button class="sign-out" @click="signOut"><span class="fas fa-sign-out-alt"></span>Выйти</button>
               </div>
               <ul class="nav-menu sidebar-padding">
                   <li class="nav-menu-item"><nuxt-link to="/settings" tag="a">Настройки</nuxt-link></li>
                   <li class="nav-menu-item" v-show="getStatisticPage === 'true'"><nuxt-link to="/statistic" tag="a" class="nav-link">Статистика</nuxt-link></li>
               </ul>
       </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import AdwordsNetwork from "../../adwords-network";
    const AdwordsNetworks = new AdwordsNetwork();
    export default {
        name: "Header",
        data({getChoose,getLogin,getEmail}){
            return{
                currentUrl: this.$route.fullPath,
                chooseObj:{
                    isChoose: getChoose,
                    clientID: null,
                    clientName: null
                },
                loginObj:{
                    isLoginIn: getLogin,
                    emailUser: getEmail,
                    clients: []
                },
                chooseViewObj:{
                    accountId: null,
                    webPropertyId: null,
                    profileId: null,
                    isChooseView: false
                }
            }
        },
        computed: {
            ...mapGetters({
                getLogin: 'localStorage/getLogin',
                getEmail: 'localStorage/getEmail',
                getClients: 'localStorage/getClients',
                getClientID: 'localStorage/getClientID',
                getClientName: 'localStorage/getClientName',
                getChoose: 'localStorage/getChoose',
                getChooseView: 'localStorage/getChooseView',
                getStatisticPage: 'localStorage/getStatisticPage',
                getSideBar: 'localStorage/getSideBar',
                getAccountId: 'localStorage/getAccountId',
                getWebPropertyId: 'localStorage/getWebPropertyId',
                getProfileId: 'localStorage/getProfileId'
            })
        },
        methods:{
            signOut(){
                this.$gAuth.signOut()
                    .then(() => {
                        this.$router.push({name:'SignIn'});
                       this.loginObj.isLoginIn = false;
                       this.loginObj.emailUser = null;
                       this.$store.dispatch('localStorage/LoginIn',this.loginObj);
                       this.chooseObj.isChoose =  false;
                       this.$store.dispatch('localStorage/chooseClient', this.chooseObj);
                       this.chooseViewObj.isChooseView = false;
                       this.$store.dispatch('localStorage/chooseViewId', this.chooseViewObj);
                       this.$store.dispatch('localStorage/editStatisticPage',false);
                       console.log(this.getChoose);
                       console.log(this.getChooseView);
                       AdwordsNetworks
                           .signOut()
                           .then(()=>{
                        }).catch((error)=>{
                            console.log(error);
                        });
                    })
                    .catch(error  => {
                        console.log(error);
                    })
            }
        }
    }
</script>

<style scoped>

</style>