import {  parentPort } from 'worker_threads';
import AnalyticsAnalyzer from "../../../../analytics/analytics";
import WorkerHelper from "../../../../WorkerHelper/helper";
const analyzeGA = async (periodafter: string,periodbefore: string,diffdate: string,profileId: string,filters:string) =>{
    const Analytics = new AnalyticsAnalyzer();
    return await Analytics.analyzeConvRate(periodafter,periodbefore,diffdate,profileId,filters).then(async (data)=>{
       return await data
    }).catch((err)=>{
        console.error(err);
    });
};
const calculateConvRate = (oldMetrics: any) =>{
    console.log('calc is work');
  return  oldMetrics.map((item: { metrics: { conversions_from_interactions_rate: number; }; })=>{
            item.metrics.conversions_from_interactions_rate = item.metrics.conversions_from_interactions_rate?item.metrics.conversions_from_interactions_rate:0;
            return item;
  });
};
const startGaWorker = async (path:string,response:any) =>{
    const Worker = new WorkerHelper();
    return  await Worker.sendDataToWorker(path,response).then((newObj)=>{
        return newObj;
    }).catch((error)=>{
        console.error(error);
    });
};
const calcGA = async (path:string,filters:string,periodafter: string,periodbefore: string,diffdate: string,profileId:string) =>{
    return  await analyzeGA(periodafter,periodbefore,diffdate,profileId,filters).then(async (response)=>{
        return await startGaWorker(path,response).then((rez)=>{
            return rez;
        }).catch((error)=>{
            console.error(error);
        });
    }).catch((err)=>{
        console.error(err);
    });
};
// @ts-ignore
parentPort.on('message', async ({currentMetrics,oldMetrics,analyticsAccount:{periodafter,periodbefore,diffdate,profileId}}) => {
    try {
        console.log('Star analyze Conv Rate GA');
        const convRateSearch = await calcGA('./api/adwords/workers/workersCalculation/calculateConvRate/calcGA/','ga:medium==organic,ga:medium==direct,ga:source==google',periodafter,periodbefore,diffdate,profileId).then((rez)=>{
           return  rez;
        }).catch((err)=>{
            console.error(err);
        });
        const convRateCPC = await calcGA('./api/adwords/workers/workersCalculation/calculateConvRate/calcGA/','ga:medium==cpc,ga:source==google',periodafter,periodbefore,diffdate,profileId).then((rez)=>{
           return  rez;
        }).catch((err)=>{
            console.error(err);
        });
        const calcData:any = async (oldMetrics: any) =>{
            const Worker = new WorkerHelper();
            const ConvRateObj = {
                oldMetrics: calculateConvRate(oldMetrics),
                currentMetrics,
                convRateSearch,
                convRateCPC
            };
            return await  Worker.sendDataToWorker('./api/adwords/workers/workersCalculation/calculateConvRate/calcAdwordsData/',ConvRateObj).then((newObj)=>{
                console.log(newObj);
                return newObj;
            }).catch((error)=>{
                console.error(error);
            });
        };
        calcData(oldMetrics).then((data: any)=>{
            console.log(data);
            // @ts-ignore
            parentPort.postMessage(data);
        }).catch((error: any)=>{
            console.error(error);
        });
    }catch (error) {
        console.error(error);
    }
});