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


const loginID = 'rahmanovicjenmarie385@outlook.com';
const password = '@Q2D1R2J9Z1Q8V2Da';

// const encodedLoginID = encodeURIComponent(loginID);
// const encodedPassword = encodeURIComponent(password);
// console.log(encodedLoginID); // KocyigitJohn675%40gmail.com
// console.log(encodedPassword); // ivmkq_Abc_!258


const api_key = "CAP-EC5F3697B76BC9FCD54AC4AF7037634B"; // TODO: your api key
// const page_url = "https://euro2024-sales.tickets.uefa.com/"; // Define your page URL here
const proxy = "de1.4g.iproyal.com:7281:uRV5sGr:mC94nHLam2AuRgw"; // TODO: your proxy
// const proxyUrl = "http://zthN7i4UIYGgvqME:mobile;de;vodafone+germany;;@23.109.148.44:9000"
const proxyUrl = 'http://uRV5sGr:mC94nHLam2AuRgw@de1.4g.iproyal.com:7281';
const user_agent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";


const cookies = {
  'esiForcedLanguage': 'en',
  'idp_locale': 'en',
  'gig_canary': 'false',
  'gig_canary_ver': '16081-3-28650600',
  'gig_bootstrap_3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5': 'idp-prod_ver4',
  'gig_bootstrap_3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv': 'idp-prod_ver4',
}


const headers = {
  'User-Agent': user_agent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Priority': 'u=1',
    'TE': 'trailers'
}



async function cookieUpdate(cookieArray) {
  console.log("COOKIES FUNTION")
  cookieArray.forEach(cookie => {
      const keyValue = cookie.split(";")[0];
      console.log(keyValue)
      const key = String(keyValue.split("=")[0]);
      const value = keyValue.split("=")[1];
      cookies[key] = value;
      console.log(`KEY ${key}  VALUE ${value}`)
  });
}

async function parseCookies(cookiesArray) {
  const parsedCookies = cookiesArray.reduce((cookies, cookie) => {
    const parts = cookie.split(';')[0].split('=');
    cookies[parts[0].trim()] = parts[1].trim();
    return cookies;
  }, {});
  return parsedCookies;
}

function serializeCookies(cookiesObject) {
  return Object.entries(cookiesObject).map(([key, value]) => `${key}=${value}`).join('; ');
}

async function websdkboot(){
  try{
  const response = await fetch('https://idp-prod.uefa.com/accounts.webSdkBootstrap?apiKey=3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv&pageURL=https%3A%2F%2Fwww.uefa.com%2Feuro2024%2F&sdk=js_latest&sdkBuild=16081&format=json',{
      headers:headers,
      credentials:'include',
      cookies:cookies,
    });
    if (response.ok) {
      const responseCookies = response.headers.raw()['set-cookie'];
      const parsedCookies = await parseCookies(responseCookies);
      Object.assign(cookies, parsedCookies);
      console.log("Updated Cookies:", cookies);
      console.log("Serialized Cookies:", serializeCookies(cookies));
      await login_complete()
    } else {
      console.log("Bad response:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
}

async function login_complete() {
  try {
    const loginID = 'rahmanovicjenmarie385@outlook.com';
    const password = '@Q2D1R2J9Z1Q8V2Da';

    const response = await fetch('https://idp-prod.uefa.com/accounts.login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...headers,
        'Cookie': serializeCookies(cookies),
        'Accept': '*/*',
      },
      // body: `loginID=${encodeURIComponent(loginID)}&password=${encodeURIComponent(password)}&sessionExpiration=31536000&targetEnv=jssdk&include=profile%2Cdata%2Cemails%2Csubscriptions%2Cpreferences%2C&includeUserInfo=true&loginMode=standard&lang=en&riskContext=%7B%22b0%22%3A14563%2C%22b1%22%3A%5B43%2C47%2C62%2C57%5D%2C%22b2%22%3A6%2C%22b3%22%3A%5B%5D%2C%22b4%22%3A3%2C%22b5%22%3A1%2C%22b6%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64%3B%20rv%3A127.0)%20Gecko%2F20100101%20Firefox%2F127.0%22%2C%22b7%22%3A%5B%7B%22name%22%3A%22PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chrome%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chromium%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Microsoft%20Edge%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22WebKit%20built-in%20PDF%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%5D%2C%22b8%22%3A%2212%3A28%3A42%20pm%22%2C%22b9%22%3A-330%2C%22b10%22%3A%7B%22state%22%3A%22prompt%22%7D%2C%22b11%22%3Afalse%2C%22b12%22%3Anull%2C%22b13%22%3A%5Bnull%2C%221920%7C1080%7C24%22%2Cfalse%2Ctrue%5D%7D&APIKey=3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5&source=showScreenSet&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fwww.uefa.com%2F&sdkBuild=16081&format=json`,
      body: 'loginID=rober.tjames7322%40gmail.com&password=%25W7V9R8D6B2I7A3Pa&sessionExpiration=31536000&targetEnv=jssdk&include=profile%2Cdata%2Cemails%2Csubscriptions%2Cpreferences%2C&includeUserInfo=true&loginMode=standard&lang=en&riskContext=%7B%22b0%22%3A14563%2C%22b1%22%3A%5B43%2C47%2C62%2C57%5D%2C%22b2%22%3A6%2C%22b3%22%3A%5B%5D%2C%22b4%22%3A3%2C%22b5%22%3A1%2C%22b6%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64%3B%20rv%3A127.0)%20Gecko%2F20100101%20Firefox%2F127.0%22%2C%22b7%22%3A%5B%7B%22name%22%3A%22PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chrome%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chromium%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Microsoft%20Edge%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22WebKit%20built-in%20PDF%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%5D%2C%22b8%22%3A%2212%3A28%3A42%20pm%22%2C%22b9%22%3A-330%2C%22b10%22%3A%7B%22state%22%3A%22prompt%22%7D%2C%22b11%22%3Afalse%2C%22b12%22%3Anull%2C%22b13%22%3A%5Bnull%2C%221920%7C1080%7C24%22%2Cfalse%2Ctrue%5D%7D&APIKey=3__N-xOlzJ6RNTtosKWZJvECS0U7fE12-78J9VzwEGBwwoaUXfji5hn-uaK9930RN5&source=showScreenSet&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fwww.uefa.com%2F&sdkBuild=16081&format=json'
    });

    if (response.ok) {
      console.log("LOGIN COMPLETED SUCCESSFULL : ",response.status)
      const data  = await response.json();
      console.log(data)
      const responseCookies = response.headers.raw()['set-cookie'];
      const parsedCookies = await parseCookies(responseCookies);
      Object.assign(cookies, parsedCookies);
      console.log("Updated Cookies:", cookies);
      console.log("Serialized Cookies:", serializeCookies(cookies));
      await fetchWithNoRedirects();
    } else {
      console.log("Bad response:", response.status);
    }
  } catch (error) {
    console.error("Error in login_complete:", error);
  }
}

async function euro2024_ticketing() {
  console.log("euro2024_ticketing  FUNCTION")
  try {
    const response = await fetch('https://www.uefa.com/euro2024/ticketing/', {
      headers: {
        ...headers,
        'Cookie': serializeCookies(cookies),
      },
      agent: new HttpsProxyAgent(proxyUrl),
    });

    if (response.status === 200) {
      console.log("euroTICKETING:", response.status);
      await fetchWithNoRedirects();
    } else {
      console.log("EURO TICKETING: Bad status", response.status);
    }
  } catch (error) {
    console.error("Error in euro2024_ticketing:", error);
  }
}


async function fetchWithNoRedirects() {
  console.log("fetchWithNoRedirects  FUNCTION")
  try {
    while (true) {
      const response = await fetch('https://access-ticketshop.uefa.com/pkpcontroller/selectqueue.do?source=https://euro2024-sales.tickets.uefa.com/&queueName=q-euro-2024', {
        redirect: 'manual',
        headers: {
          ...headers,
          'Cookie': serializeCookies(cookies),
        },
        agent: new HttpsProxyAgent(proxyUrl),
      });

      console.log("fetchWithNoRedirects RESPONSE CHECK:", response.status);

      if (response.status >= 300 && response.status < 400) {
        const res_url = response.headers.get('location');
        console.log('Redirect detected:', res_url);
        const responseCookies = response.headers.raw()['set-cookie'];
        const parsedCookies = await parseCookies(responseCookies);
        Object.assign(cookies, parsedCookies);
        console.log("Updated Cookies:", cookies);
        
        // Example: Handle redirection based on the URL
        if (res_url.startsWith('https://access-ticketshop.uefa.com')) {
          await pkpcontroller(res_url);
        } else {
          const modify_url = 'https://access-ticketshop.uefa.com' + res_url;
          await pkpcontroller(modify_url);
        }
      } else if (response.status === 403) {
        console.log("403 Forbidden - CAPTCHA or other restriction encountered");
        // Implement CAPTCHA handling or other logic here
        await handle403(response.url);
      } else {
        const data = await response.json(); // Example: parsing JSON response
        console.log('Data:', data);
        // Handle other responses normally
      }
    }
  } catch (error) {
    console.error("Error in fetchWithNoRedirects:", error);
  }
}

async function pkpcontroller(url) {
  try {
    const response = await fetch(url, {
      headers: {
        ...headers,
        'Cookie': serializeCookies(cookies),
      },
      agent: new HttpsProxyAgent(proxyUrl),
    });
    console.log("RESPONSE CHECK:", response.status, "url:", response.url);
    
    if (response.status === 200) {
      console.log("GOOD RESPONSE");

      // Example: Update cookies after successful response
      cookies['updated-cookie'] = 'value';
      console.log("FINAL COOKIES:", cookies);
      
      await euro2024();
    } else if (response.status === 403) {
      console.log("403 Forbidden - CAPTCHA or other restriction encountered");
      await handle403(response.url);
    } else {
      console.log("BAD RESPONSE:", response.status);
    }
  } catch (error) {
    console.error("Error in pkpcontroller:", error);
  }
}


async function euro2024() {
  try {
    while (true) {
      const response = await fetch('https://euro2024-sales.tickets.uefa.com/', {
        redirect: 'manual',
        headers: {
          // 'User-Agent': user_agent,
          'Cookie': serializeCookies(cookies),
        },
        agent: new HttpsProxyAgent(proxyUrl),
      });

      console.log("RESPONSE CHECK:", response.status);

      if (response.status >= 300 && response.status < 400) {
        const res_url = response.headers.get('location');
        console.log('Redirect detected:', res_url);
        const responseCookies = response.headers.raw()['set-cookie'];
        const parsedCookies = await parseCookies(responseCookies);
        Object.assign(cookies, parsedCookies);
        console.log("Updated Cookies:", cookies);
        // Handle redirection based on the URL
      } else if (response.status === 403) {
        console.log("403 Forbidden - CAPTCHA or other restriction encountered");
        await handle403(response.url);
      } else {
        const data = await response.json(); // Example: parsing JSON response
        console.log('Data:', data);
        // Handle other responses normally
      }
    }
  } catch (error) {
    console.error("Error in euro2024:", error);
  }
}



async function handle403(url) {
  try {
    console.log("Handling CAPTCHA or other restrictions for URL:", url);
    // Implement CAPTCHA solving or other logic here
    await get_captcha_url(url);
  } catch (error) {
    console.error("Error handling 403:", error);
  }
}

// websdkboot();

async function get_captcha_url(url){
  const response = await fetch(url,{
    headers : {
      'content-type': 'application/json',
      'user-agent': user_agent,
      'accept': 'application/json, text/plain, */*',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': url,
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
      'Cookie': serializeCookies(cookies),

  },
    agent: new HttpsProxyAgent(proxyUrl)
  });
  console.log("RESPONSE CHECK KKKKKKKKKKKKKKKKKKKKKKKKK,",response.status)
  if(response.status === 403){
    const res_url = await response.json();
    const catp_url = res_url.url;
    console.log("CAPTCHA URL : ",catp_url)
    datadome_check(url,catp_url)
  }else{
    console.log("RESPONSE CHECK 0000000000000000000,",response.status)
  }
}

async function datadome_check(url,page_url) {
  console.log("Entering datadome_check with URL:", url);
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
  if (url.includes('t=bv')) {
      console.log("CAPTCHA BLOCKED && YOU HAVE BEEN BLOCKED");
    } else {
      console.log("JUST WAIT I WILL SOLVE THIS CAPTCHA");
      await capsolver(url,page_url)
    }};



  async function capsolver(url, catp_url) {
    console.log("GOING TO CAPSOLVER FUNCTION");
  
    const payload = {
      clientKey: api_key,
      task: {
        type: 'DatadomeSliderTask',
        websiteURL: url,
        captchaUrl: catp_url,
        proxy: "de1.4g.iproyal.com:7281:uRV5sGr:mC94nHLam2AuRgw",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
      }
    };
  
    try {
      const res = await axios.post("https://api.capsolver.com/createTask", payload);
      const task_id = res.data.taskId;
      if (!task_id) {
        console.log("Failed to create task:", res.data);
        return;
      }
      console.log("Got taskId:", task_id);
  
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
  
        const getResultPayload = { clientKey: api_key, taskId: task_id };
        const resp = await axios.post("https://api.capsolver.com/getTaskResult", getResultPayload);
        const status = resp.data.status;
  
        if (status === "ready") {
          console.log("CAPTCHA solved successfully");
  
          // Extract and update the solved cookie from CAPTCHA solution
          const solvedCookie = resp.data.solution.cookie.split(';')[0].split('=')[1];
          console.log("SOLVED DATADOME CHECK : ",solvedCookie)
          cookies['datadome'] = solvedCookie;
  
          console.log("Updated Cookies:", cookies);
  
          // Proceed to the next step in your application flow
          await pkpcontroller(url); // Example continuation, adjust as per your flow
          break;
        }
  
        if (status === "failed" || resp.data.errorId) {
          console.log("Solve failed! Response:", resp.data);
          return;
        }
      }
    } catch (error) {
      console.error("Error in capsolver:", error);
    }
  }



websdkboot();


// async function datadome_solve(url,page_url){
//   console.log("CALL CAPSOLVER ----------------->")
//   const data = {
//     clientKey: api_key,
//     task: {
//         type: 'DatadomeSliderTask',
//         websiteURL: page_url,
//         captchaUrl: url,
//         userAgent: user_agent,
//         proxy: proxy
//     }
//   }
//   console.log("FIRST TIME CHECK DATA :",data);

//   try {
//     const createTaskRes = await fetch('https://api.capsolver.com/createTask', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     });
    
//     const createTaskJson = await createTaskRes.json();
//     const task_id = createTaskJson.taskId;

//     if (!task_id) {
//         console.log("create task error:", createTaskJson);
//         return;
//     }

//     while (true) {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

//         const getTaskRes = await fetch('https://api.capsolver.com/getTaskResult', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ taskId: task_id })
//         });
        
//         const getTaskJson = await getTaskRes.json();
//         const status = getTaskJson.status;

//         if (status === "ready") {
//             const cookie = getTaskJson.solution.cookie.split(';')[0].split('=')[1];
//             console.log("successfully got cookie:", cookie);
//             return cookie;
//         } else if (status === "failed" || getTaskJson.errorId) {
//             console.log("failed to get cookie:", getTaskJson);
//             return;
//         }
//         console.log('solve datadome status:', status);
//     }
// } catch (error) {
//     console.error("Error in get_token:", error.message);
// }
// }

