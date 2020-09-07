"use strict";
const GoogleAdsApi = require('google-ads-api').GoogleAdsApi;
import WorkerHelper from "../WorkerHelper/helper";

export  default  class AdwordsAnalyzer{
    private client_id:string = '546347433408-70qm8gtk177kn2fspd0aveiparmc4u8e.apps.googleusercontent.com';
    private client_secret:string = '_GXnzcMN8DgARuXURVw9DXVu';
    private developer_token:string = 'nYM-mhiSdy4GlGc64KZ64Q';
    private customer_account_id:string = '3224356504';
    private refresh_token:string = '1//04BcoxN9OxE7nCgYIARAAGAQSNwF-L9Irg2M-qaUMFnd9YbX9gY8IYJw2UkjcH1PDEJBHn9H5C_oAull_tjzIpDn7MV5yNWR3iQU';
    protected login:boolean | string= '3224356504';
    protected zcpa:string|null|undefined;
    protected zconvAds:string|null|undefined;
    protected anAccuracy:string|null|undefined;
    protected accountId:string|null|undefined;
    protected webPropertyId:string|null|undefined;
    protected profileId:string|null|undefined;
    protected periodbefore:string|null|undefined;
    protected periodafter:string|null|undefined;
    protected diffdate:string|null|undefined;
    protected convAdwords:any|null|undefined;
    protected currentAdsCompanies: any = [];
    constructor(){

    }
    loginIn = (clientID = false) =>{
        this.login = clientID?clientID:this.login;
        const client = new GoogleAdsApi({
            client_id: this.client_id,
            client_secret: this.client_secret ,
            developer_token: this.developer_token
        });
        console.log('User is login in');
        // 2. Load a customer with a valid CID & authentication
        return  client.Customer({
            customer_account_id: this.login,
            login_customer_id: this.customer_account_id,
            refresh_token: this.refresh_token
        });
    };
    // Получаем всех пользователей
    getAllCustomers = async (customer: { query: (arg0: string) => any; }):Promise<any> =>{
        console.log('User get All customers');
        return await customer.query(`
            SELECT
                 customer_client.level,
                 customer_client.resource_name,
                 customer_client.client_customer,
                 customer_client.id,
                 customer.id,
                 customer_client.descriptive_name,
                 customer.descriptive_name
            FROM
                customer_client
            WHERE
                customer_client.level != 0
            ORDER BY
                 customer_client.level ASC,
                 customer_client.id ASC
        `);
    };
    // Выбор аккаунта Adwords
    chooseAccount = async (id:string = '3224356504',customer:any):Promise<any> =>{
        this.login = id;
        console.log('User choose account');
        return customer.get(id);
    };
    // Получение целей с Adwords
    getAllConversionsAds = async (customer: { conversionActions: { list: () => any; }; }):Promise<any> =>{
        console.log('User get all conversion');
        return await customer.conversionActions.list();
    };
    // Установка дефолтных данных для анализа
    setDefaultData = async (zcpa:string,zconvAds:string,anAccuracy:string,periodbefore:string,periodafter:string,diffdate:string,convAdwords:any[],adwordsAccount:string,accountId:string,webPropertyId:string,profileId:string) =>{
        this.zcpa = zcpa;
        this.zconvAds = zconvAds;
        this.anAccuracy = anAccuracy;
        this.periodbefore = periodbefore;
        this.periodafter = periodafter;
        this.convAdwords = convAdwords;
        this.diffdate = diffdate;
        this.login = adwordsAccount;
        this.accountId = accountId;
        this.webPropertyId = webPropertyId;
        this.profileId = profileId;
        console.log('User start calculation methods');
        //Запускаем проверку компании
        return await this.analyzeCurrentCompanies(this.loginIn()).then((res) => {
            console.log('Calculation methods is ready');
            return res;
        }).catch((err) => {
            console.error(err);
        });
    };
    // Запуск анализа компаний
    analyzeCurrentCompanies = async (customer: any) =>{
        try {
            console.log('Start calculate companies');
            return await this.calculateMetrics(customer).then(async (newMetrics)=>{
                console.log('End calculate Metrics');
                return await  this.analyzeConvRate(customer, newMetrics).then(async (convRate)=>{
                    await this.analyzeConversion(customer,convRate).then((conversions)=>{
                        return conversions
                    }).catch((error)=>{
                        console.error(error);
                    })

                }).catch((error)=>{
                    console.error(error);
                });
            }).catch((error)=>{
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    };
    // Анализ метрик
    calculateMetrics = async (customer: { query: (arg0: string) => any; }) =>{
        try {
            const getMetrics = await customer.query(`
                  SELECT
                     campaign.id,
                     campaign.name,
                     metrics.impressions,
                     metrics.cost_per_conversion,
                     metrics.conversions_from_interactions_rate
                FROM
                    campaign
                WHERE
                    customer.id = ${this.login}
                    AND segments.date BETWEEN '${this.periodbefore}' AND '${this.periodafter}'
                ORDER BY
                     campaign.id ASC
          `);
            const currentMetrics = [...getMetrics];
            const Worker = new WorkerHelper();
            return  await Worker.sendDataToWorker('./api/adwords/workers/workersCalculation/calculateMetrics/',{currentMetrics,zcpa: this.zcpa}).then((newObj)=>{
                this.currentAdsCompanies = [...this.currentAdsCompanies,newObj];
                console.log('Worker is calculated metrics');
                return newObj;
            }).catch((error)=>{
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    };
    // // Анализ сравнение конверсий
    analyzeConversion = async (customer: { query: (arg0: string) => any; },currentObj: any) =>{
        const test = currentObj;
        const result = this.convAdwords.map((item: any)=>{
            return  this.getAllConversions(customer,item.name).then((convInfo)=>{
                return convInfo;
            }).catch((error)=>{
                console.error(error);
            })
        });
        console.log(result);
        return result;
    };
    //Получаем конверсии
    getAllConversions = async (customer: { query: (arg0: string) => any; }, convName: any) =>{
        return  await customer.query(`
                      SELECT
                      segments.conversion_action, metrics.all_conversions, segments.conversion_action_name, campaign.name
                      FROM campaign
                      WHERE segments.conversion_action_name = '${convName}'
               `);
    };
    // Анализ конв рейта
    analyzeConvRate = async (customer: { query: (arg0: string) => any; }, currentMetrics: any)=>{
        try {
            const analyzeConvRate = await customer.query(`
              SELECT
                 campaign.id,
                 campaign.name,
                 metrics.impressions,
                 metrics.cost_per_conversion,
                 metrics.conversions_from_interactions_rate
            FROM
                campaign
            WHERE
                customer.id = ${this.login}
                AND segments.date BETWEEN '${this.diffdate}' AND '${this.periodbefore}'
            ORDER BY
                 campaign.id ASC
           `);
            //Проверка цены
            const ConvRateObj ={
                currentMetrics: [...currentMetrics],
                oldMetrics: [...analyzeConvRate],
                analyticsAccount: {
                    periodafter: this.periodafter,
                    periodbefore: this.periodbefore,
                    diffdate: this.diffdate,
                    profileId: this.profileId
                }
            };
            const Worker = new WorkerHelper();
            return await Worker.sendDataToWorker('./api/adwords/workers/workersCalculation/calculateConvRate/',ConvRateObj).then((newObj)=>{
                this.currentAdsCompanies  = [...this.currentAdsCompanies,newObj];
                console.log('Worker is calculated Conv Rate');
                return newObj;
            }).catch((error)=>{
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    };
}
