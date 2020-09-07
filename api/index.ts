'use stricts';
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
// const AnalyticsAnalyzer  = require('./analytics/analytics');
import AnalyticsAnalyzer from './analytics/analytics';
//AdwordsAnalyzer Settings
import AdwordsAnalyzer from './adwords/adwords';
let currentUser = '3224356504';
//Settings for localhost
app.use((req: any, res: { setHeader: (arg0: string, arg1: string) => void; }, next: () => void) :void=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
//Get users
app.post("/users", jsonParser, function(req: { body: { id: any; email: any; }; }, res: { sendStatus: (arg0: string | number) => void; send: (arg0: any) => void; }):void{
  if(!req.body) return res.sendStatus(400);
  const Analyzer:AdwordsAnalyzer = new AdwordsAnalyzer();
  let {id,email} = req.body;
  if(id == "102921703569506449611" && email == "hi@optimozg.com"){
    Analyzer.getAllCustomers(Analyzer.loginIn()).then((response: any)=>{
      res.send(response);
    }).catch((error: any)=>{
      console.error(error);
      res.send(error);
    });
  }else{
    res.sendStatus('400');
  }
});
//Get Companies
app.post("/chooseUser", jsonParser,function (req:any, res:any):void {
  if(!req.body) return res.sendStatus(400);
  const Analyzer:AdwordsAnalyzer = new AdwordsAnalyzer();
  let {number} = req.body;
  currentUser = number == 'false'?'3224356504':number;
  Analyzer.chooseAccount(currentUser,Analyzer.loginIn()).then((response: any)=>{
    res.send(response);
  }).catch((error: any)=>{
    console.error(error);
    res.send(error);
  });

});
//Get all conversion
app.post('/getAllConversionsAds',jsonParser,function (req:any,res:any):void {
  if(!req.body) return res.sendStatus(400);
  const Analyzer:AdwordsAnalyzer = new AdwordsAnalyzer();
  let {adwordsAccount} = req.body;
  Analyzer.getAllConversionsAds(Analyzer.loginIn(adwordsAccount)).then((response: any)=>{
    res.send(response);
  }).catch((error: any)=>{
    console.error(error);
    res.send(error);
  });
});

//Get data from form for Analyzer
app.post('/IncomingData',jsonParser,function (req: { body: { zcpa: any; zconvAds: any; anAccuracy: any; periodbefore: any; periodafter: any; diffdate: any; convAdwords: any; adwordsAccount: any; accountId: any; webPropertyId: any; profileId: any; }; }, res: { sendStatus: (arg0: number) => any; send: (arg0: any) => void; }):any{
  if(!req.body) return res.sendStatus(400);
  const Analyzer:AdwordsAnalyzer = new AdwordsAnalyzer();
  let {zcpa,zconvAds,anAccuracy,periodbefore,periodafter,diffdate,convAdwords,adwordsAccount,accountId,webPropertyId,profileId} = req.body;
  Analyzer.setDefaultData(zcpa,zconvAds,anAccuracy,periodbefore,periodafter,diffdate,convAdwords,adwordsAccount,accountId,webPropertyId,profileId).then((response: any)=>{
    res.send(response);
  }).catch(((error: any) => {
    console.error(error);
    res.send(error);
  }));
  // Analytics.setDefaultData(zcpa,anAccuracy,periodbefore,periodafter,convAnalytics,zconvAnalytics).then((response: any)=>{
  //     res.send(response);
  // }).catch((error: any)=>{
  //     res.send(error);
  // })
});
/* == Analytics == */
//Choose Analytics View Id
app.get('/getGAPerm',jsonParser,function(req: { body: any; }, res: { sendStatus: (arg0: number) => void; send: (arg0: any) => void; }):void {
  if(!req.body) return res.sendStatus(400);
  const Analytics:AnalyticsAnalyzer = new AnalyticsAnalyzer();
  Analytics.authorizeGA().then((rez)=>{
    res.send(rez);
  }).catch((err)=>{
    console.error(err);
    res.send(err);
  });
});
app.post('/chooseViewId',jsonParser,function(req: { body: { accountId: string; webPropertyId: string; profileId: string; }; }, res: { sendStatus: (arg0: string | number) => void; }):void {
  if(!req.body) return res.sendStatus(400);
  const Analytics:AnalyticsAnalyzer = new AnalyticsAnalyzer();
  let {accountId,webPropertyId,profileId} = req.body;
  Analytics.loginToGa(accountId,webPropertyId,profileId);
  res.sendStatus('200');
});
//Choose Analytics Conversion
app.post('/getGoals',jsonParser,function (req: { body: any; }, res: { sendStatus: (arg0: number) => void; send: (arg0: any) => void; }):void {
  if(!req.body) return res.sendStatus(400);
  const Analytics:AnalyticsAnalyzer = new AnalyticsAnalyzer();
  let {accountId,webPropertyId,profileId} = req.body;
  Analytics.getGoals(accountId,webPropertyId,profileId).then((result: { data: { items: any; }; })=>{
    res.send(result.data.items)
  }).catch((error: any)=>{
    console.error(error);
    res.send(error);
  });
});
// начинаем прослушивать подключения на 3000 порту
// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
