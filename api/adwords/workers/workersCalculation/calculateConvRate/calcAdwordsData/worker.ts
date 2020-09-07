import {  parentPort } from 'worker_threads';
// eslint-disable-next-line no-unused-vars
const checkGaRate = (convRateSearch:any,convRateCPC:any,currentItem:any) =>{
    if(convRateSearch == 'false'){
        currentItem.messages = [...currentItem.messages,'Падение конверт рейта по всему сайту.Рекомендоуем проверить трекинг и сайт'];
    }
    if(convRateCPC == 'false'){
        currentItem.messages = [...currentItem.messages,'Что-то с сайтом или рекламой'];
    }
    if(convRateCPC == 'true'){
        currentItem.messages = [...currentItem.messages,'Что-то с трекингом adwords'];
    }
    return currentItem;
};
const calculateConvRate = (old: any,current: any,currentMetrics: any,convRateSearch: any,convRateCPC: any) =>{
    if(old === 0 && current === 0){
        currentMetrics.message = true;
        currentMetrics.messages = [...currentMetrics.messages,'Мало данных для анализа Conversion rate!'];
        currentMetrics.diffConvRate = 0;
        currentMetrics = checkGaRate(convRateSearch,convRateCPC,currentMetrics);
    }else if(old!==0 && current!==0 && current>=old && typeof old == "number" && typeof current == "number") {
        currentMetrics.diffConvRate = +(((current/old)*100)-100);
        if(currentMetrics.diffConvRate<25){
            currentMetrics.message = true;
            currentMetrics.messages = [...currentMetrics.messages,'Проблема с сайтом или с рекламой!'];
            currentMetrics = checkGaRate(convRateSearch,convRateCPC,currentMetrics);
        }
    }else if(old!==0 && current!==0 && current<old && typeof old == "number" && typeof current == "number"){
        currentMetrics.diffConvRate = +(100 - ((current/old)*100));
        if(currentMetrics.diffConvRate<25){
            currentMetrics.message = true;
            currentMetrics.messages = [...currentMetrics.messages,'Проблема с сайтом или с рекламой!'];
            currentMetrics = checkGaRate(convRateSearch,convRateCPC,currentMetrics);
        }
    }
    return currentMetrics;
};
// @ts-ignore
parentPort.on('message', async ({oldMetrics,currentMetrics,convRateSearch,convRateCPC}) => {
    try {
        let old,current: number;
        const result = currentMetrics.map((item: any, index: string | number)=>{
            if(item.checkCPA){
                old =  +oldMetrics[index].metrics.conversions_from_interactions_rate;
                current = +item.metrics.conversions_from_interactions_rate;
                item = calculateConvRate(old,current,item,convRateSearch,convRateCPC);
            }
            return item;
            });
        console.log('End calcute conv rate in Worker');
        // @ts-ignore
        parentPort.postMessage(result);
    }catch (error) {
        console.error(error);
    }

});
