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
      },
      body: `loginID=${encodeURIComponent(loginID)}&password=${encodeURIComponent(password)}&sessionExpiration=31536000&targetEnv=jssdk&include=profile%2Cdata%2Cemails%2Csubscriptions%2Cpreferences%2C&includeUserInfo=true&loginMode=standard&lang=en&riskContext=%7B%22b0%22%3A34067%2C%22b1%22%3A%5B67%2C60%2C90%2C93%5D%2C%22b2%22%3A8%2C%22b3%22%3A%5B%5D%2C%22b4%22%3A2%2C%22b5%22%3A1%2C%22b6%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64%3B%20rv%3A127.0)%20Gecko%2F20100101%20Firefox%2F127.0%22%2C%22b7%22%3A%5B%7B%22name%22%3A%22PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chrome%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chromium%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Microsoft%20Edge%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22WebKit%20built-in%20PDF%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%5D%2C%22b8%22%3A%227%3A24%3A58%20pm%22%2C%22b9%22%3A-330%2C%22b10%22%3A%7B%22state%22%3A%22prompt%22%7D%2C%22b11%22%3Afalse%2C%22b12%22%3Anull%2C%22b13%22%3A%5Bnull%2C%221920%7C1080%7C24%22%2Cfalse%2Ctrue%5D%7D&APIKey=3_goMvlNo1VWX5L5utb5xemUCFy1qmn0rJWb_JLrDwznqr7WUmg_FhjxGhLzl1Jpwv&source=showScreenSet&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fwww.uefa.com%2Feuro2024%2F&sdkBuild=16081&format=json`,
    });

    if (response.ok) {
      const responseCookies = response.headers.raw()['set-cookie'];
      const parsedCookies = await parseCookies(responseCookies);
      Object.assign(cookies, parsedCookies);
      console.log("Updated Cookies:", cookies);
      console.log("Serialized Cookies:", serializeCookies(cookies));
      await euro2024_ticketing();
    } else {
      console.log("Bad response:", response.status);
    }
  } catch (error) {
    console.error("Error in login_complete:", error);
  }
}

async function euro2024_ticketing() {
  try {
    const response = await fetch("https://www.uefa.com/euro2024/ticketing/", {
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
  try {
    while (true) {
      const response = await fetch('https://access-ticketshop.uefa.com/pkpcontroller/selectqueue.do?...', {
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
    await solveCAPTCHA(url);
  } catch (error) {
    console.error("Error handling 403:", error);
  }
}

async function solveCAPTCHA(url) {
  try {
    // Example CAPTCHA solving process with Capsolver API
    const payload = {
      clientKey: api_key,
      task: {
        type: 'DatadomeSliderTask',
        websiteURL: url,
        captchaUrl: catp_url,
        proxy: "de1.4g.iproyal.com:7281:uRV5sGr:mC94nHLam2AuRgw",
        userAgent: userAgent,
      },
    };

    const res = await axios.post("https://api.capsolver.com/createTask", payload);
    const task_id = res.data.taskId;

    if (!task_id) {
      console.log("Failed to create task:", res.data);
      return;
    }

    console.log("Got taskId:", task_id);

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second

      const getResultPayload = { clientKey: 'your-capsolver-client-key', taskId: task_id };
      const resp = await axios.post("https://api.capsolver.com/getTaskResult", getResultPayload);
      const status = resp.data.status;

      if (status === "ready") {
        const solvedCookie = resp.data.solution.cookie.split(';')[0].split('=')[1];
        cookies['datadome'] = solvedCookie; // Update your specific cookie

        console.log("Successfully solved CAPTCHA. Updated Cookies:", cookies);
        break;
      }

      if (status === "failed" || resp.data.errorId) {
        console.log("Solve failed! Response:", resp.data);
        break;
      }
    }
  } catch (error) {
    console.error("Error solving CAPTCHA:", error);
  }
}

// Initial function call to start the process
websdkboot();