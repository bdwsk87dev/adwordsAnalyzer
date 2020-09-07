import axios from "axios";
export default class AdwordsNetwork{
    _url = 'http://localhost:8084';
    signOut = async () =>{
        return await axios({
            url: `/api/chooseUser`,
            method: 'POST',
            data: JSON.stringify({
                number: 'false'
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
    };
    signIn = async (id,email,name,accessToken,idToken) =>{
         return await axios({
            url: `/api/users`,
            method: 'POST',
            data: JSON.stringify({
                id,
                email,
                name,
                accessToken,
                idToken
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
    };
    getAccounts = async () =>{
        return await axios({
            url: `/api/getGAPerm`,
            method: 'GET',
            headers:{
                "Content-Type": "application/json"
            }
        })
    };
    chooseUser = async (id) =>{
        return await axios({
            url: `/api/chooseUser`,
            method: 'POST',
            data: JSON.stringify({
                number:id
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
    };
    chooseViewId= async (accountId,webPropertyId,profileId) =>{
        return await axios({
            url: `/api/chooseViewId`,
            method: 'POST',
            data: JSON.stringify({
                accountId,
                webPropertyId,
                profileId
            }),
            headers:{
                "Content-Type": "application/json"
            }
        })
    };
    getAllConversionsAds = async (adwordsAccount) =>{
        return await axios({
            url: `/api/getAllConversionsAds`,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({adwordsAccount:adwordsAccount})
        })
    };
    getGoals = async (accountId,webPropertyId,profileId) =>{
        return await axios({
            url: `/api/getGoals`,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                accountId,
                webPropertyId,
                profileId
            })
        })
    };
    incomingData = async (zcpa,zconvAds,anAccuracy,periodbefore,periodafter,diffdate,convAdwords,adwordsAccount,accountId,webPropertyId,profileId) =>{
        return await axios({
            url: `/api/IncomingData`,
            method: 'POST',
            data: JSON.stringify({
                zcpa,zconvAds,anAccuracy,periodbefore,periodafter,diffdate,convAdwords,adwordsAccount,accountId,webPropertyId,profileId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}