<template>
    <div>
        <ToggleSidebar/>
        <Loader :isLoad="isLoad"></Loader>
            <div class="statistic-container" v-if="isLoad">
                <div class="statistic-wrapper" v-if="currentCompanies && currentCompanies.length>0">
                    <div class="statistic-item" v-for="(company,index) in currentCompanies" :key="index">
                        <div class="statistic-header flex-container" :data-companyId="company.campaign.id">
                            <h3 class="company-name">{{company.campaign.name}}</h3>
                            <button class="btn-status" :class="{'btn-status':true,'btn-error':company.message,'btn-ok':!company.message}">
                                <font-awesome-icon icon="exclamation"  v-if="company.message" />
                                <font-awesome-icon icon="check"  v-if="!company.message"  />
                            </button>
                            <ul class="statistic-props">
                                <li class="statistic-props-item">CPA: {{company.metrics.cost_per_conversion}}</li>
                                <li class="statistic-props-item">Conversion Rate: {{company.metrics.conversions_from_interactions_rate}}</li>
                            </ul>
                        </div>
                        <ul class="statistic-error-message" v-if="company.messages">
                            <li class="statistic-error-item" v-for="(error,index) in company.messages" :key="index">
                                <span class="statistic-error-text">{{error}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="statistic-wrapper" v-else-if="this.getCompanies.length === 0">
                    <div class="statistic-info">Недостаточно данных для анализа компаний 😥</div>
                </div>
            </div>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import ToggleSidebar from "../../components/header/ToggleSidebar";
    import Loader from "../../components/loader/Loader";
    export default {
        name: "Statistic",
        layout: 'withHeader',
        components: {Loader, ToggleSidebar},
        data(){
            return{
                viewMessage: true,
                isLoad: false,
                currentCompanies: null,
            }
        },
        computed: {
            ...mapGetters({
                getCompanies: 'localStorage/getCompanies',
                getStatisticPage: 'localStorage/getStatisticPage',
            })
        },
        created(){
            if(this.getStatisticPage === 'false'){
               this.$router.push('/settings');
            }  
        },
        mounted() {
            this.isLoad = true;
            this.currentCompanies = this.getCompanies;
            console.log(this.currentCompanies);
        },
    }
</script>

<style scoped>

</style>