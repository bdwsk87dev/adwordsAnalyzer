import {  parentPort } from 'worker_threads';
// @ts-ignore
parentPort.on('message', async ({convRateAfter,convRateBefore}) => {
    try {
            let result: boolean = false,  old = +convRateAfter, current = +convRateBefore;
            if (old === 0 && current === 0) {
                result = false;
            } else if (old !== 0 && current !== 0 && current >= old && typeof old == "number" && typeof current == "number") {
                result = (+(((current / old) * 100) - 100)>=25);
            } else if (old !== 0 && current !== 0 && current < old && typeof old == "number" && typeof current == "number") {
                result = (+(100 - ((current / old) * 100)) >= 25);
            }
           // @ts-ignore
        parentPort.postMessage(`${result}`);
    }catch (e) {
        console.error(e);
    }

});