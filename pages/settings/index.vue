<template>
        <div class="settings-container">
            <ToggleSidebar/>
            <div class="content-container">
                <form action="" class="settings-form" @submit.prevent="AnalyzerSubmit">
                    <div class="settings-item">
                        <label for="zcpa">Желаемая цена за конверсию:</label>
                        <input type="number" id="zcpa" v-model.lazy="convObj.zcpa" class="settings-form-item" required>
                    </div>
                    <div class="settings-item">
                        <label for="periodbefore">Период от:</label>
                        <input type="date" id="periodbefore" v-model.lazy="convObj.periodbefore" class="settings-form-item" required>
                    </div>
                    <div class="settings-item">
                        <label for="periodafter">Период до:</label>
                        <input type="date" id="periodafter" :min="convObj.periodbefore" v-model.lazy="convObj.periodafter" class="settings-form-item" required>
                    </div>
                    <div class="settings-item">
                        <label for="analyze">Точность анализа:</label>
                        <input type="number" id="analyze" v-model.lazy="convObj.anAccuracy" v-mask="'#.##'" class="settings-form-item" min="0" max="1" step="0.01" required>
                    </div>
                    <div class="settings-item">
                        <label for="season">Сезонность:</label>
                        <input type="number" max="2" min="1" id="season" class="settings-form-item">
                    </div>
                    <div class="settings-item">
                        <div class="flex-container settings-header">
                            <label>Названия конверсии в Adwords</label>
                            <span class="add-conv" @click="chooseConvAds" >+</span>
                        </div>
                        <div class="settings-form-item settings-form-area">
                            <div class="conv-container">
                                <div class="setting-form-area-item"  v-for="conv in convObj.convAdwords" :key="conv.id">
                                    <span class="conversion-name">{{ conv.name }}</span>
                                    <font-awesome-icon icon="times-circle" class="close-conv" @click="deleteAds(conv.id)" />
                                </div>
                            </div>
                        </div>
                        <p class="error" v-if="isAdsErr">Выберите нужные конверсии! Если конверсий нет,тогда выберите, пожалуйста, другой аккаунт</p>
                    </div>
                    <div class="settings-item">
                        <div class="flex-container settings-header">
                            <label>Названия конверсии в Analytics</label>
                            <span class="add-conv" @click="chooseConvAnalytics" >+</span>
                        </div>
                        <div class="settings-form-item settings-form-area">
                            <div class="conv-container">
                                <div class="setting-form-area-item"  v-for="(conv,index) in convObj.convAnalytics" :key="index">
                                    <span class="conversion-name">{{ conv }}</span>
                                    <font-awesome-icon icon="times-circle" class="close-conv" @click="deleteAnalytics(conv)" />
                                </div>
                            </div>
                        </div>
                        <p class="error" v-if="isAnErr">Выберите нужные конверсии! Если конверсий нет,тогда выберите,пожалуйста,другой аккаунт</p>
                    </div>
                    <input type="submit" class="btn btn-submit signin btn-secondary settings-submit" value="Отправить" v-if="isLoad">
                    <Loader :isLoad="isLoad"></Loader>
                </form>
                <div class="clients-container" v-if="isConvAds">
                    <h3 class="clients-title">Выберите конверсии Adwords:</h3>
                    <ul class="flex-container clients-list" v-if="allConvAdwords.length>0">
                        <li class="clients-list-item" v-for="conv in allConvAdwords"  :key="conv.id" :data-adsId="conv.id" @click="chooseAds($event,conv.id,conv.name)">
                          {{ conv.name }}
                        </li>
                    </ul>
                    <div class="conv-error" v-else-if="allConvAdwords.length === 0">Недостаточно данных для анализа.<br>Выберите, пожалуйста, другой аккаунт</div>
                    <button class="btn btn-submit signin btn-secondary submit-conv" @click="submitAds">Подтвердить</button>
                </div>
                <div class="clients-container" v-if="isConvAnalytics">
                    <h3 class="clients-title">Выберите конверсии Analytics:</h3>
                    <ul class="flex-container clients-list" v-if="allConvAnalytics.length>0">
                        <li class="clients-list-item" v-for="(conv,index) in allConvAnalytics"  :key="index" @click="chooseAnalytics($event)">{{ conv }}</li>
                    </ul>
                    <div class="conv-error" v-else-if="allConvAnalytics.length===0">Недостаточно данных для анализа.<br>Выберите, пожалуйста ,другой аккаунт</div>
                    <button class="btn btn-submit signin btn-secondary submit-conv" @click="submitAnalytics">Подтвердить</button>
                </div>
                <p class="error" v-show="isErr.error">{{isErr.messages}}</p>
            </div>
        </div>
</template>

<script>
    import dateformat from 'dateformat';
    import moment from 'moment';
    import ToggleSidebar from "../../components/header/ToggleSidebar";
    import {mapGetters} from "vuex";
    import Loader from "../../components/loader/Loader";
    import AdwordsNetwork from "../../adwords-network";
    const AdwordsNetworks = new AdwordsNetwork();
    export default {
        name: "Settings",
        layout: 'withHeader',
        middleware: 'authSettings',
        components: {Loader, ToggleSidebar},
        data(){
            return{
                isLoad: true,
                convObj:{
                    zcpa: null,
                    zconvAds: null,
                    zconvAnalytics: null,
                    anAccuracy: 0.03,
                    periodbefore: null,
                    periodafter: null,
                    diffdate: null,
                    convAdwords: [],
                    convAnalytics: [],
                    adwordsAccount: null,
                    accountId: null,
                    webPropertyId: null,
                    profileId: null
                },
                isConvAds: false,
                isConvAnalytics: false,
                currentAdsConv: [],
                allConvAdwords: [],
                currentAnalyticsConv: [],
                allConvAnalytics: [],
                isAdsErr: false,
                isAnErr: false,
                isErr:{
                    error: false,
                    messages: ''
                },
                isAdsEmpty: false,
                isGAEmpty: false
            }
        },
        watch:{
            'convObj.convAdwords': function () {
                this.convObj.zconvAds = this.convObj.convAdwords.length;
            },
            'convObj.convAnalytics':function () {
                this.convObj.zconvAnalytics = this.convObj.convAnalytics.length;
            },
            'convObj.periodbefore':function () {
                this.convObj.periodbefore = dateformat(this.convObj.periodbefore,'isoDate');
            },
            'convObj.periodafter':function () {
                this.convObj.periodafter = dateformat(this.convObj.periodafter,'isoDate');
            }
        },
        computed: {
            ...mapGetters({
                getChooseView: 'localStorage/getChooseView',              
                getClientID: 'localStorage/getClientID',
                getAccountId: 'localStorage/getAccountId',
                getWebPropertyId: 'localStorage/getWebPropertyId',
                getProfileId: 'localStorage/getProfileId'
            })
        },
        methods:{
            //Выбираем все компании
            chooseConvAds(){
                this.allConvAdwords = [];
                this.currentAdsConv = [];
                if(!this.isConvAds) {
                    this.convObj.adwordsAccount = this.getClientID;
                    AdwordsNetworks
                        .getAllConversionsAds(this.convObj.adwordsAccount)
                     .then((res) => {
                        console.log(res);
                        for (let i = 0; i < res.data.length; i++) {
                            this.allConvAdwords.push({name:res.data[i].conversion_action.name,id:res.data[i].conversion_action.id});
                        }
                        this.isConvAds = true;
                    }).catch((error)=>{
                        console.log(error);
                    })
                }
            },
            // Выбираем определенные цели
            chooseAds(e,id,name){
                let currentIndex = this.currentAdsConv.indexOf(id,0);
                if(e.target.classList ==='clients-list-item active') {
                    this.currentAdsConv.splice(currentIndex,1);
                }else{
                    this.currentAdsConv.push({id,name:name.trim()});
                }
                e.target.classList.toggle('active');
            },
            // Подтверждаем выбор цели
            submitAds(){
                this.convObj.convAdwords = [...this.currentAdsConv];
                console.log(this.convObj.convAdwords);
                this.isConvAds = false;
                this.isAdsErr = false;
            },
            // Удаление лишней цели из списка
            deleteAds(conv){
                let currentIndex = this.convObj.convAdwords.indexOf(conv,0);
                this.convObj.convAdwords.splice(currentIndex,1);
            },
            chooseConvAnalytics(){
                this.allConvAnalytics = [];
                this.currentAnalyticsConv = [];
                if(this.isConvAnalytics === false) {
                    this.convObj.accountId = this.getAccountId;
                    this.convObj.webPropertyId =  this.getWebPropertyId;
                    this.convObj.profileId = this.getProfileId;
                    AdwordsNetworks
                        .getGoals(this.convObj.accountId,this.convObj.webPropertyId,this.convObj.profileId)
                        .then((res) => {
                        for (let i = 0; i < res.data.length; i++) {
                            this.allConvAnalytics.push(res.data[i].name);
                        }
                        this.isConvAnalytics = true;
                    })
                }
            },
            chooseAnalytics(e){
                let currentText = e.target.textContent;
                let currentIndex = this.currentAnalyticsConv.indexOf(currentText,0);
                console.log(currentIndex);
                if(e.target.classList ==='clients-list-item active') {
                    this.currentAnalyticsConv.splice(currentIndex,1);
                }else{
                    this.currentAnalyticsConv.push(currentText);
                }
                e.target.classList.toggle('active');
            },
            submitAnalytics(){
                this.convObj.convAnalytics = [];
                this.convObj.convAnalytics = [...this.currentAnalyticsConv];
                console.log(this.convObj.convAnalytics);
                this.isConvAnalytics = false;
                this.isAnErr = false;
            },
            deleteAnalytics(conv){
                let currentIndex = this.convObj.convAnalytics.indexOf(conv,0);
                this.convObj.convAnalytics.splice(currentIndex,1);
            },
            AnalyzerSubmit(){
                if(this.convObj.convAdwords.length === 0){
                    this.isAdsErr = true;
                }else if(this.convObj.convAnalytics.length === 0){
                    this.isAnErr = true;
                }else{
                    this.isLoad = false;
                    this.isAdsErr = false;
                    this.isAnErr = false;
                    let beforeDate = moment(this.convObj.periodbefore);
                    let afterDate = moment(this.convObj.periodafter);
                    let resDate = afterDate.diff(beforeDate,'days');
                    const date = new Date(this.convObj.periodbefore);
                    date.setDate(date.getDate() - resDate);
                    this.convObj.diffdate = dateformat(date,'isoDate');
                    console.log(this.convObj.diffdate);
                    let {zcpa,zconvAds,anAccuracy,periodbefore,periodafter,diffdate,convAdwords,adwordsAccount,accountId,webPropertyId,profileId} = this.convObj;
                    AdwordsNetworks
                        .incomingData(zcpa,zconvAds,anAccuracy,periodbefore,periodafter,diffdate,convAdwords,adwordsAccount,accountId,webPropertyId,profileId)
                        .then((res)=>{
                        this.isLoad = true;
                        this.$store.dispatch('localStorage/setCompanies',res.data);
                        this.$store.dispatch('localStorage/editStatisticPage',true);
                        this.$router.push('/statistic');
                    }).catch((err)=>{
                        this.isError.error = true;
                        this.isError.messages = err;
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>