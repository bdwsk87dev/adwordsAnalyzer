export default function ({app,redirect}) {
    if(app.$cookies.get('getChooseView') == 'true'){
        redirect('/settings');
    }
}