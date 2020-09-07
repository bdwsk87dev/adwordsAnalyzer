import { Worker } from 'worker_threads';
export default class WorkerHelper {
    constructor(){

    }
    workerTs = (file: string, wkOpts: { workerData: any }) => {
        // @ts-ignore
        wkOpts.eval = true;
        // @ts-ignore
        if (!wkOpts.workerData) {
            // @ts-ignore
            wkOpts.workerData = {};
        }
        // @ts-ignore
        wkOpts.workerData.__filename = file;
        return new Worker(`
            const wk = require('worker_threads');
            require('ts-node').register();
            let file = wk.workerData.__filename;
            delete wk.workerData.__filename;
            require(file);
        `,
            wkOpts
        );
    };
    startWorker = (path: string, cb: { (err: any, result: any): void; (err: any, result: any): void; (arg0: any, arg1: any): void; }) =>{
        // let w = new Worker(path, {workerData: null});
        let w = this.workerTs(path+'worker.ts', {workerData: null});
        w.on('message', (msg: any) => {
            cb(null, msg)
        });
        w.on('error', cb);
        w.on('exit', (code: number) => {
            if(code != 0)
                console.error(new Error(`Worker stopped with exit code ${code}`))
        });
        return w;
    };
    sendDataToWorker = async (url: string,postMsg: any) =>{
        return await new Promise((resolve,reject)=>{
            const metricWorker =  this.startWorker(`${url}`, (err: any, result: any) => {
                if(err){
                    console.error(err);
                    reject(err); }
                if(result){
                    resolve(result);
                }
            });
            metricWorker.postMessage(postMsg);
        });
    }
};