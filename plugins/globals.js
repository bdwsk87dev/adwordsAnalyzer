import Vue from 'vue';
import GAuth from 'vue-google-oauth2';
import VueMask from 'v-mask';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueMask);
const gauthOption = {
    clientId: '546347433408-70qm8gtk177kn2fspd0aveiparmc4u8e.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/adwords',
    prompt: 'select_account'
};
Vue.use(GAuth, gauthOption);
