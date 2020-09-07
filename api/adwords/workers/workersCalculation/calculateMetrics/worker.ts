import {  parentPort } from 'worker_threads';
// eslint-disable-next-line no-unused-vars
// @ts-ignore
parentPort.on('message', async ({currentMetrics,zcpa}) => {
    try {
        let imprOfAccount: number = 0,
            resultImpr: any = 0,
            newMetrics: any[] = [],
            currentPricePerClick = +zcpa;
        const calculateMetrics = new Promise((resolve)=>{
            currentMetrics.forEach((item:any)=>{
                imprOfAccount += item.metrics.impressions;
                newMetrics = [...newMetrics,item];
            });
            resolve(imprOfAccount);
        });
        let rez = await calculateMetrics.then((res:any) => {
            //Анализ компаний
            return newMetrics.map((item) => {
                item.isActive = false;
                item.checkCPA = false;
                item.metrics.cost_per_conversion = item.metrics.cost_per_conversion?+item.metrics.cost_per_conversion:0;
                item.metrics.conversions_from_interactions_rate = item.metrics.conversions_from_interactions_rate?+item.metrics.conversions_from_interactions_rate:0;
                resultImpr = +(item.metrics.impressions / res);
                item.message = false;
                item.messages = [];
                //Проверка компании
                if (resultImpr < 0.03) {
                    item.isActive = false;
                    item.message = true;
                    item.messages = [...item.messages,'Мало данных для  анализа  данной компании!'];
                }else{
                    item.isActive = true;
                    //Проверка CPA
                    if(item.metrics.cost_per_conversion>currentPricePerClick) {
                        item.checkCPA = true;
                    }else{
                        item.message = true;
                        item.messages = [...item.messages, 'CPA впорядке.'];
                    }
                }
                return item;
            });
        });
        // @ts-ignore
        parentPort.postMessage(rez);
    }catch (error) {
        console.error(error);
    }
});