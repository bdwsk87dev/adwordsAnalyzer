
export const state = () => ({
    isSideBar: process.client&&localStorage.isSideBar?localStorage.isSideBar:false,
    isLogin: process.client&&localStorage.isLoginIn?localStorage.isLoginIn:false,
    isChoose: process.client&&localStorage.chooseClient?localStorage.chooseClient:false,
    isChooseView: process.client&&localStorage.isChooseView?localStorage.isChooseView:false,
    email: process.client&&localStorage.email?localStorage.email:null,
    clients: null,
    gaAccounts: null,
    clientID: process.client&&localStorage.clientID?localStorage.clientID:null,
    clientName: process.client&&localStorage.clientName?localStorage.clientName:null,
    accountId: process.client&&localStorage.accountId?localStorage.accountId:null,
    webPropertyId: process.client&&localStorage.webPropertyId?localStorage.webPropertyId:null,
    profileId: process.client&&localStorage.profileId?localStorage.profileId:null,
    companies: process.client&&localStorage.companies?localStorage.companies:null,
    statisticPage: process.client&&localStorage.statPage?localStorage.statPage:false,
    });
export const getters = {
        getLogin: state => {
            return state.isLogin
        },
        getEmail: state => {
            return state.email;
        },
        getClients: state => {
            return state.clients;
        },
        getGaAccounts: state => {
            return state.gaAccounts;
        },
        getClientID: state => {
            return state.clientID;
        },
        getClientName: state => {
            return state.clientName;
        },
        getChoose: state => {
            return state.isChoose;
        },
        getChooseView: state => {
            return state.isChooseView;
        },
        getCompanies: state => {
            return JSON.parse(state.companies);
        },
        getStatisticPage: state => {
            return state.statisticPage;
        },
        getSideBar: state => {
            return state.isSideBar;
        },
        getAccountId: state => {
            return state.accountId;
        },
        getWebPropertyId: state => {
            return state.webPropertyId;
        },
        getProfileId: state => {
            return state.profileId;
        }
    };
export const mutations = {
        LoginIn(state,loginObj){
            let {isLoginIn,emailUser,clients,gaAccounts} = loginObj;
            localStorage.email = emailUser;
            localStorage.isLoginIn = isLoginIn;
            state.isLogin = localStorage.isLoginIn;
            state.email = localStorage.email;
            state.clients = clients;
            state.gaAccounts = gaAccounts;
        },
        chooseClient(state,chooseObj){
            let {isChoose,clientID,clientName} = chooseObj;
            localStorage.clientName = clientName;
            localStorage.clientID = clientID;
            localStorage.chooseClient = isChoose;
            state.isChoose = localStorage.chooseClient;
            state.clientID = localStorage.clientID;
            state.clientName = localStorage.clientName;
        },
        chooseViewId(state,chooseViewObj){
            let {accountId,webPropertyId,profileId,isChooseView} = chooseViewObj;
            localStorage.accountId = accountId;
            localStorage.webPropertyId = webPropertyId;
            localStorage.profileId = profileId;
            localStorage.isChooseView = isChooseView;
            this.$cookies.set('isChooseView', isChooseView, {
                path: '/'
              })
            state.accountId = localStorage.accountId;
            state.webPropertyId = localStorage.webPropertyId;
            state.profileId = localStorage.profileId;
            state.isChooseView = localStorage.isChooseView;
        },
        setCompanies(state,companies){
            localStorage.companies = JSON.stringify(companies);
            state.companies = localStorage.companies
        },
        editStatisticPage(state,editPage){
            localStorage.statPage = editPage;
            state.statisticPage = localStorage.statPage;
        },
        toggleSideBar(state,isSideBar){
            localStorage.isSideBar = isSideBar;
            state.isSideBar = isSideBar;
        },
    };
export const actions = {
        LoginIn(content,loginObj){
            content.commit('LoginIn',loginObj)
        },
        chooseClient(content,chooseObj){
            content.commit('chooseClient',chooseObj)
        },
        chooseViewId(content,chooseViewObj){
            content.commit('chooseViewId',chooseViewObj);
        },
        setCompanies(content,companies){
            content.commit('setCompanies',companies)
        },
        editStatisticPage(content,editPage){
            content.commit('editStatisticPage',editPage);
        },
        toggleSideBar(content,isSideBar){
            content.commit('toggleSideBar',isSideBar);
        }
};
