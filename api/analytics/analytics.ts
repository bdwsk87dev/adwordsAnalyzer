"use strict";
const { google } = require('googleapis');
const key = require('../auth/auth');
const scopesData = 'https://www.googleapis.com/auth/analytics.readonly';
const jwtData = new google.auth.JWT(key.client_email, null, key.private_key, scopesData);
const analytics = google.analytics({
    version: "v3",
    auth: jwtData
});
export default class AnalyticsAnalyzer{
    protected zcpa:string|null| undefined;
    protected zconvAds:string|null| undefined;
    protected anAccuracy:string|null| undefined;
    protected accountId:string|null| undefined;
    protected webPropertyId: string | null | undefined;
    protected profileId:string|null| undefined;
    protected periodbefore:string|null| undefined;
    protected periodafter:string|null| undefined;
    protected diffdate:string|null| undefined;
    protected accountsGA:any = [];
    constructor(){

    }
    // Список аккаунтов GA
    listAccounts = async ():Promise<[]> =>{
        const request = await analytics.management.accounts.list();
        return request.data.items;
    };
    // Авторизация в GA
    authorizeGA = async () =>{
        let accounts = await this.listAccounts().then(res=>res);
        for(let i = 0;i<accounts.length;i++){
            // @ts-ignore
            this.accountsGA.push({accountId:[{id:accounts[i].id,name:accounts[i].name}],webProperties:[],profileId:[]});
        }
        for(let v = 0;v<this.accountsGA.length;v++){
            this.accountsGA[v].webProperties =
                await analytics.management.webproperties.list({
                    'accountId': `${this.accountsGA[v].accountId[0].id}`
                }).then((res: { data: { items: any; }; })=> {
                    return res.data.items
                }).then((res: string | any[])=>{
                        const rez = [];
                        for(let i = 0;i<res.length;i++){
                            rez.push({id:res[i].id,name:res[i].name,accId:res[i].accountId});
                        }
                        return rez;
                    }
                )
        }
        for(let w =  0;w<this.accountsGA.length;w++){
            for(let i = 0;i<this.accountsGA[w].webProperties.length;i++){
                this.accountsGA[w].profileId =
                    await analytics.management.profiles.list({
                        'accountId': `${this.accountsGA[w].accountId[0].id}`,
                        'webPropertyId': `${this.accountsGA[w].webProperties[i].id}`
                    }).then((res: { data: { items: any; }; })=>res.data.items).then((res: string | any[])=>{
                            const rez = [];
                            for(let i = 0;i<res.length;i++){
                                rez.push({id:res[i].id,name:res[i].name,accId:res[i].accountId,webPropId:res[i].webPropertyId});
                            }
                            return rez;
                        }
                    )
            }
        }
        return this.accountsGA;
    };
    loginToGa(accountId: string, webPropertyId: string, profileId: string):void{
        this.accountId = accountId;
        this.webPropertyId = webPropertyId;
        this.profileId = profileId;
    }
    async getInfo(from: any, to: any, data: any):Promise<any> {
        const defaults = {
            'auth': jwtData,
            'ids': 'ga:' + this.profileId,
        };
        // const response = await jwt.authorize();
        return google.analytics('v3').data.ga.get({
            ...defaults,
            'start-date': from,
            'end-date': to,
            ...data
        });
    }
    // Анализ конв рейта в аналитике
   analyzeConvRate = async (periodafter: any,periodbefore: any,diffdate: any,profileId: any,filters: string):Promise<any> => {
        const defaults = {
            'auth': jwtData,
            'ids': `ga:${profileId}`,
        };
        const analyzeBefore = await this.getConvRate(periodbefore,periodafter,defaults,filters).then((rez)=>{
            return rez.data.rows[0][0];
        }).catch(err=>err);
        const analyzeAfter = await this.getConvRate(diffdate,periodbefore,defaults,filters).then((rez)=>{
            return rez.data.rows[0][0];
        }).catch(err=>err);
        return {
            convRateAfter: analyzeAfter,
            convRateBefore: analyzeBefore
        }
    };
   getConvRate = async (from: any,to: any,settings: any,filters: string):Promise<any>=>{
       return await google.analytics('v3').data.ga.get({
           ...settings,
           'start-date': from,
           'end-date': to,
           'metrics': 'ga:goalConversionRateAll',
           'filters': filters
       });
   };
   // Список целей
    getGoals = async (accountId: any, webPropertyId: any, profileId: any):Promise<any> =>{
        const data = {
            accountId: accountId,
            webPropertyId: webPropertyId,
            profileId: profileId
        };
        return analytics.management.goals.list(data);
    };
    // Установка дефолтных данных
    setDefaultData = (zcpa:string,zconvAds:string,anAccuracy:string,periodbefore:string,periodafter:string,diffdate:string,convAdwords:string,accountId:string,webPropertyId:string,profileId:string):void =>{
        this.zcpa = zcpa;
        this.zconvAds = zconvAds;
        this.anAccuracy = anAccuracy;
        this.periodbefore = periodbefore;
        this.periodafter = periodafter;
        this.diffdate = diffdate;
        this.accountId = accountId;
        this.webPropertyId = webPropertyId;
        this.profileId = profileId;
    }
}
