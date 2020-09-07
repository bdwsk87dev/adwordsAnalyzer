<template>
    <div class="clients-container" v-if="getLogin === 'true'">
        <div class="ad-container">
            <h3 class="clients-title">Выберите аккаунт в Adwords:</h3>
            <select class="form-control accounts-select"  v-model="clientId">
                <option  v-for="(item,key) in getClients" :key="key" :value="item">{{item}}</option>
            </select>
        </div>
        <transition name="fade">
        <div class="google-acc-container" v-show="chooseObj.isChoose">
            <h3 class="clients-title">Выберите GA аккаунт:</h3>
            <select  v-model="accountId" class="form-control accounts-select" v-for="(group,index) in  getGaAccounts" :key="index">
               <option  v-for="(item,key) in group.accountId" :key="key" :value="item.id">{{item.name}}</option>
            </select>
        </div>
        </transition>
        <transition name="fade">
        <div class="google-web-container" v-show="viewWeb">
            <h3 class="clients-title">Выберите GA ресурс:</h3>
            <select v-model="webPropertyId"  class="form-control accounts-select">
                <option  v-for="(item,key) in webPropertyIds" :key="key" :value="item.id">{{item.name}}</option>
            </select>
        </div>
        </transition>
        <transition name="fade">
        <div class="google-profile-container" v-show="viewProf">
            <h3 class="clients-title">Выберите GA представление:</h3>
            <select v-model="profileId" class="form-control accounts-select">
                <option  v-for="(item,key) in profileIds" :key="key" :value="item.id">{{item.name}}</option>
            </select>
        </div>
        </transition>
        <p class="danger-info">Внимание! Перед отправкой View ID добавьте к данной почте доступ google-analytics-api@thematic-fort-624.iam.gserviceaccount.com в вашем аккаунте!</p>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import AdwordsNetwork from "../../adwords-network";
    const AdwordsNetworks = new AdwordsNetwork();
    export default {
        name: "GoogleAccounts",
        data(){
            return{
                isError: false,
                viewWeb: false,
                viewProf: false,
                clientId: null,
                accountId: null,
                webPropertyId: null,
                webPropertyIds: [],
                profileId: null,
                profileIds: [],
                chooseObj:{
                    isChoose:false,
                    clientID: null,
                    clientName: null
                },
                chooseViewObj:{
                    accountId: null,
                    webPropertyId: null,
                    profileId: null,
                    isChooseView: false
                },
                loginObj:{
                    isLoginIn: false,
                    emailUser: null,
                    clients: [],
                    gaAccounts: []
                },
            }
        },
        computed: {
            ...mapGetters({
                getLogin: 'localStorage/getLogin',
                getEmail:'localStorage/getEmail',
                getClients: 'localStorage/getClients',
                getChooseView: 'localStorage/getChooseView',
                getGaAccounts: 'localStorage/getGaAccounts'
        })
        },
        watch:{
            'clientId':function (id) {
                AdwordsNetworks.chooseUser(id)
                .then((response)=>{
                    this.chooseObj.clientID = response.data.id;
                    this.chooseObj.clientName = response.data.descriptive_name;
                    this.chooseObj.isChoose = true;
                    this.$store.dispatch('localStorage/chooseClient',this.chooseObj);
                }).catch((error)=>{
                    console.log(error);
                    this.chooseObj.isChoose = false;
                    this.chooseObj.clientID = null;
                    this.$store.dispatch('localStorage/chooseClient',this.chooseObj);
                    this.loginObj.isLoginIn = false;
                    this.loginObj.clients = [];
                    this.loginObj.emailUser = null;
                    this.$store.dispatch('localStorage/LoginIn',this.loginObj);
                })},
                'accountId': function (accountId) {
                    this.chooseViewObj.accountId = accountId;
                    this.getGaAccounts.filter((item)=>{
                          item.webProperties.filter((items)=>{
                              if(items.accId === accountId){
                                  this.webPropertyIds.push(items);
                              }
                          });
                    });
                    this.viewWeb = true;
                },
                'webPropertyId': function (webPropertyId) {
                    this.chooseViewObj.webPropertyId = webPropertyId;
                    this.getGaAccounts.filter((item)=>{
                        item.profileId.filter((items)=>{
                            if(items.accId === this.chooseViewObj.accountId && items.webPropId == webPropertyId){
                                this.profileIds.push(items);
                            }
                        });
                    });
                    this.viewProf = true;
                },
                'profileId': function (profileId) {
                    let accountId = this.chooseViewObj.accountId,
                        webPropertyId =this.chooseViewObj.webPropertyId;
                    AdwordsNetworks
                        .chooseViewId(accountId,webPropertyId,profileId)
                        .then(()=>{
                        this.chooseViewObj.isChooseView = true;
                        this.chooseViewObj.profileId=  profileId;
                        this.$store.dispatch('localStorage/chooseViewId',this.chooseViewObj);
                        this.viewWeb = false;
                        this.viewProf = false;
                        this.chooseObj.isChoose = false;
                        this.$store.dispatch('localStorage/chooseClient',this.chooseObj);
                        this.$router.push('/settings');
                    }).catch((error)=>{
                        console.log(error);
                        this.viewWeb = false;
                        this.viewProf = false;
                        this.chooseObj.isChoose = false;
                        this.chooseObj.clientID = null;
                        this.$store.dispatch('localStorage/chooseClient',this.chooseObj);
                        this.$store.dispatch('localStorage/LoginIn',this.loginObj);
                    })
                }
        },
        methods:{
        }
    }
</script>

<style scoped>

</style>