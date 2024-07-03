import fetch from "node-fetch";
import cheerio  from "cheerio";
import { Blog } from "../model.js";
import { Ticket } from "./model.js";
import mongoose from "mongoose";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";


mongoose.connect(
  "mongodb://localhost:27017/", 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);
const dataFromIndexJs = JSON.parse(process.argv[2]);
console.log(dataFromIndexJs)


const api_key = "CAP-80942CD5330077705C476AAF1CE7A5A9"; // TODO: your api key
const page_url = "https://euro2024-sales.tickets.uefa.com/"; // Define your page URL here
const proxy = "de1.4g.iproyal.com:7281:uRV5sGr:mC94nHLam2AuRgw"; // TODO: your proxy
const proxyUrl = 'http://uRV5sGr:mC94nHLam2AuRgw@de1.4g.iproyal.com:7281';
const user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
// let cookies = {};


// class OFFER{
//   constructor(){
//     console.log("START BOT ")
// const cookies = {
//   'idp_locale': 'en',
//   'apiDomain_3_sYfcE10kapaZyRZ4K42nJ6o0Yw8hjrU2FlxN0ZYx31bBRwIISLXl3UtuUWYgIzLD': 'idp-prod.uefa.com',
//   'gig3pctest': 'true',
// }
  
//     this.headers = {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
//         'Accept': '*/*',
//         'Accept-Language': 'en-US,en;q=0.5',
//         'Accept-Encoding': 'gzip, deflate, br, zstd',
//         'Origin': 'https://www.uefa.com',
//         'Cookie': 'OptanonConsent=consentId=bb0dd1ed-466c-4d2a-8b54-2f74bc5bbf08&datestamp=Thu+Jun+20+2024+18%3A01%3A45+GMT%2B0530+(India+Standard+Time)&version=6.33.0&interactionCount=0&isGpcEnabled=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fwww.uefa.com%2Feuro2024%2F&groups=1%3A1%2C2%3A0%2C4%3A0; idp_locale=en; geo.Country={%22countryName%22:%22India%22%2C%22countryCode%22:%22IND%22%2C%22countryCodeShort%22:%22IN%22%2C%22fifaCountryCode%22:%22IND%22%2C%22uefaCountry%22:false}; apiDomain_3_sYfcE10kapaZyRZ4K42nJ6o0Yw8hjrU2FlxN0ZYx31bBRwIISLXl3UtuUWYgIzLD=idp-prod.uefa.com; gig3pctest=true',
//         'Connection': 'keep-alive',
//         'Referer': 'https://www.uefa.com/',
//         'Sec-Fetch-Dest': 'empty',
//         'Sec-Fetch-Mode': 'cors',
//         'Sec-Fetch-Site': 'same-site',
//         'TE': 'trailers'
//   } 
//     this.webSdkBootstrap();
//   };


  // async function webSdkBootstrap(){
  //   console.log("FIRST FUNTION")
  //   const response = await fetch('https://idp-prod.uefa.com/accounts.webSdkBootstrap?apiKey=3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv&pageURL=https%3A%2F%2Fwww.uefa.com%2Feuro2024%2F&sdk=js_latest&sdkBuild=16081&format=json',{
  //     headers:{
  //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
  //       'Accept': '*/*',
  //       'Accept-Language': 'en-US,en;q=0.5',
  //       'Accept-Encoding': 'gzip, deflate, br, zstd',
  //       'Origin': 'https://www.uefa.com',
  //       // 'Cookie': 'OptanonConsent=consentId=bb0dd1ed-466c-4d2a-8b54-2f74bc5bbf08&datestamp=Thu+Jun+20+2024+18%3A01%3A45+GMT%2B0530+(India+Standard+Time)&version=6.33.0&interactionCount=0&isGpcEnabled=0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fwww.uefa.com%2Feuro2024%2F&groups=1%3A1%2C2%3A0%2C4%3A0; idp_locale=en; geo.Country={%22countryName%22:%22India%22%2C%22countryCode%22:%22IND%22%2C%22countryCodeShort%22:%22IN%22%2C%22fifaCountryCode%22:%22IND%22%2C%22uefaCountry%22:false}; apiDomain_3_sYfcE10kapaZyRZ4K42nJ6o0Yw8hjrU2FlxN0ZYx31bBRwIISLXl3UtuUWYgIzLD=idp-prod.uefa.com; gig3pctest=true',
  //       // 'Connection': 'keep-alive',
  //       'Referer': 'https://www.uefa.com/',
  //       'Sec-Fetch-Dest': 'empty',
  //       'Sec-Fetch-Mode': 'cors',
  //       'Sec-Fetch-Site': 'same-site',
  //       'TE': 'trailers'
  //     },
  //     credentials: 'include',
  //     cookies:cookies
  
  //   });
  //   console.log("RESPONSE CHECK : ",response.status)
  //   if (response.ok) {
  //     const data = await response.json();  // Assuming response is JSON
  //     console.log("RESPONSE BODY: ", data);
  //   } else {
  //     console.log("BAD RESPONSE : ", response.status);
  //   }
  //   const responseCookies = response.headers.raw()['set-cookie'];
  //   this.cookies = parseCookies(responseCookies);
  //   console.log("Cookies received:", this.cookies);
  // // } catch (error) {
  // //   console.error("FETCH ERROR: ", error);
  // // }
  // // }
  // }
  // webSdkBootstrap()

// bot = new OFFER();
// bot.webSdkBootstrap();







console.log("BOT START ----------------->")

const cookies = {
  'ARRAffinity': 'e5d89797ff86138b1ab5001da08dac0378b84620ebc2a4140fe2964ef3cb1a40',
  'ARRAffinitySameSite': 'e5d89797ff86138b1ab5001da08dac0378b84620ebc2a4140fe2964ef3cb1a40',
  'esiForcedLanguage': 'en',
  'idp_locale': 'en',
  'OptanonConsent': 'isGpcEnabled=0&datestamp=Thu+Jun+20+2024+15%3A32%3A24+GMT%2B0530+(India+Standard+Time)&version=6.33.0&isIABGlobal=false&hosts=&consentId=34a57211-80eb-4c0f-9b90-1cc4b8f401f3&interactionCount=0&landingPath=NotLandingPage&groups=1%3A1%2C2%3A0%2C4%3A0&AwaitingReconsent=false',
  'gig_bootstrap_3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5': 'idp-prod_ver4',
  'geo.Country': '{%22countryName%22:%22India%22%2C%22countryCode%22:%22IND%22%2C%22countryCodeShort%22:%22IN%22%2C%22fifaCountryCode%22:%22IND%22%2C%22uefaCountry%22:false}',
  'glt_3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5': 'st2.s.AtLtGHz1AQ.sC8u14GniCnIhWc65YTMLKmWI7zw65TK5zpAgY9OyI9HCXanM-QrSUizSlRFsQ_H61pZLcF-VbumYj2sZL9WQXF4r3H9GPTZ0hxmdUMYfLDJJ7VIoFCXOyCz68fzJDVj.95Ic7dfL-f9m4rU8S1CPRx8BIBAWlt73Rhql8WqEiRPU_HHJehCLu3Sb8p_-tjIynhXMGfJrf_WW1B2Ccce91A.sc3',
  'gig_bootstrap_3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv': 'idp-prod_ver4',
  'glt_3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv': 'st2.s.AtLtGHz1AQ.sC8u14GniCnIhWc65YTMLKmWI7zw65TK5zpAgY9OyI9HCXanM-QrSUizSlRFsQ_H61pZLcF-VbumYj2sZL9WQXF4r3H9GPTZ0hxmdUMYfLDJJ7VIoFCXOyCz68fzJDVj.95Ic7dfL-f9m4rU8S1CPRx8BIBAWlt73Rhql8WqEiRPU_HHJehCLu3Sb8p_-tjIynhXMGfJrf_WW1B2Ccce91A.sc3',
  'AcpAT-v3-q-euro-2024': 'p21pkpcontroller1b-eea8894fd22a238e40eb934a726e91c10a657553dc70c813c544148a73a79f7a07e337f34cc5b6f932f4fb8f4d3490826795b374d396f3d05d4dd7e84230f315',
  'SERVERID-BE-INTERNET1-9050': '5338c8f7132c0a6a193cb12f7e4f0785',
  'datadome': 'UsODQY8aez0ovqZxlFdLJm2D0VlJEcx9kkzXcvvIsoBIHgJ68yGi2rYdTwtE_saKJr7fg~4Y_lZBdE0hOsvwsRnGAYd4ILed7Bv0l0vbc8TZNImGzdxI~q4KBMxC4QnJ',
}


const headers = {
  'content-type': 'application/json',
  'user-agent': user_agent,
  'accept': 'application/json, text/plain, */*',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'cors',
  // 'Cookie': 'ARRAffinity=e5d89797ff86138b1ab5001da08dac0378b84620ebc2a4140fe2964ef3cb1a40; ARRAffinitySameSite=e5d89797ff86138b1ab5001da08dac0378b84620ebc2a4140fe2964ef3cb1a40; esiForcedLanguage=en; idp_locale=en; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Jun+20+2024+15%3A32%3A24+GMT%2B0530+(India+Standard+Time)&version=6.33.0&isIABGlobal=false&hosts=&consentId=34a57211-80eb-4c0f-9b90-1cc4b8f401f3&interactionCount=0&landingPath=NotLandingPage&groups=1%3A1%2C2%3A0%2C4%3A0&AwaitingReconsent=false; gig_bootstrap_3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5=idp-prod_ver4; geo.Country={%22countryName%22:%22India%22%2C%22countryCode%22:%22IND%22%2C%22countryCodeShort%22:%22IN%22%2C%22fifaCountryCode%22:%22IND%22%2C%22uefaCountry%22:false}; glt_3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5=st2.s.AtLtGHz1AQ.sC8u14GniCnIhWc65YTMLKmWI7zw65TK5zpAgY9OyI9HCXanM-QrSUizSlRFsQ_H61pZLcF-VbumYj2sZL9WQXF4r3H9GPTZ0hxmdUMYfLDJJ7VIoFCXOyCz68fzJDVj.95Ic7dfL-f9m4rU8S1CPRx8BIBAWlt73Rhql8WqEiRPU_HHJehCLu3Sb8p_-tjIynhXMGfJrf_WW1B2Ccce91A.sc3; gig_bootstrap_3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv=idp-prod_ver4; glt_3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv=st2.s.AtLtGHz1AQ.sC8u14GniCnIhWc65YTMLKmWI7zw65TK5zpAgY9OyI9HCXanM-QrSUizSlRFsQ_H61pZLcF-VbumYj2sZL9WQXF4r3H9GPTZ0hxmdUMYfLDJJ7VIoFCXOyCz68fzJDVj.95Ic7dfL-f9m4rU8S1CPRx8BIBAWlt73Rhql8WqEiRPU_HHJehCLu3Sb8p_-tjIynhXMGfJrf_WW1B2Ccce91A.sc3; AcpAT-v3-q-euro-2024=p21pkpcontroller1b-eea8894fd22a238e40eb934a726e91c10a657553dc70c813c544148a73a79f7a07e337f34cc5b6f932f4fb8f4d3490826795b374d396f3d05d4dd7e84230f315; SERVERID-BE-INTERNET1-9050=5338c8f7132c0a6a193cb12f7e4f0785; datadome=Hmu0FwTrUnvkOKSLKQanbedggTA3lFhETeKOBVM0cStLAUnFHe4kjg7joaDESZCpe9frA_DbZtnC8ajuZJsi1QdEVV_C19b6i_YsFOTWSCXMtE0wb0Zm__TNh9rTP3XW',  'sec-fetch-dest': 'empty',
  'referer': page_url,
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
}


async function get_token(captcha_url) {
  console.log("call capsolver...");
  const data = {
      clientKey: api_key,
      task: {
          type: 'DatadomeSliderTask',
          websiteURL: page_url,
          captchaUrl: captcha_url,
          userAgent: user_agent,
          proxy: proxy
      }
  };

  try {
      const createTaskRes = await fetch('https://api.capsolver.com/createTask', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      
      const createTaskJson = await createTaskRes.json();
      const task_id = createTaskJson.taskId;

      if (!task_id) {
          console.log("create task error:", createTaskJson);
          return;
      }

      while (true) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

          const getTaskRes = await fetch('https://api.capsolver.com/getTaskResult', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ taskId: task_id })
          });
          
          const getTaskJson = await getTaskRes.json();
          const status = getTaskJson.status;

          if (status === "ready") {
              const cookie = getTaskJson.solution.cookie.split(';')[0].split('=')[1];
              console.log("successfully got cookie:", cookie);
              cookies['datadome'] = cookie;
              return cookie;
          } else if (status === "failed" || getTaskJson.errorId) {
              console.log("failed to get cookie:", getTaskJson);
              return;
          }
          console.log('solve datadome status:', status);
      }
  } catch (error) {
      console.error("Error in get_token:", error.message);
  }
}


async function requestSite(cookie) {
  console.log("request url:", page_url);
  try {
    const response = await fetch(page_url, {
      headers: headers,
      // cookies:cookies,
      credentials: 'include',  // Enable sending cookies if necessary
      agent: new HttpsProxyAgent(proxyUrl)
    });
    console.log("DATADOME CHECK :",cookies['datadome'])
    console.log("Response status code:", response.status);
    if (response.status === 403) {
      const data = await response.json();  // Assuming response contains JSON data
      console.log("Captcha URL:", data.url);
      return data.url;

    } else {
      console.log("GOOD");
    }
  } catch (error) {
    console.error("Error in request:", error);
  }
}

async function main() {
  let url = await requestSite("");
  if (!url) {
      return;
  }
  if (url.includes('t=bv')) {
      console.log("blocked captcha url is not supported");
      return;
  }
  const cookie = await get_token(url);
  if (!cookie) {
      return;
  }
  await requestSite(cookie);

  // console.log(cookies);
}

main();





dataFromIndexJs.forEach(element => {
    console.log("---------------------------------------------")
    const event_name = element.event_name;
    const event_id = element.event_id;
    const login = element.login;
    const no_of_tickets = element.no_of_tickets;
    const price = element.price;
    console.log(event_name)
    console.log(event_id)
    console.log(login)
    console.log(no_of_tickets)
    console.log(price)
    const loginsArray = login.split('\n');
            loginsArray.forEach(login => {
                // const [email, password,] = login.split(/\s+/);
                const [email, password,offer] = login.split(/\:/);
                console.log(`Email: ${email}, Password: ${password} offer: ${offer}`);
            });
});