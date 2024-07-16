import fetch from "node-fetch";
import cheerio from "cheerio";
import axios from "axios";
import { fileURLToPath } from 'url';
import path, { resolve } from 'path';
import fs from "node:fs/promises";
import { firefox } from 'playwright';
import { promisify } from 'util';
import { rejects } from "assert";
import { Ticket } from "./model.js";
import mongoose from "mongoose";

mongoose.connect(
  "mongodb://localhost:27017/", 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

const API_KEY = 'TAKION_API_T6AMY4UWSIKL144M';

class Scraper {
  constructor(event_name, event_id, event_url, no_of_tickets, price, email, password, rand_proxy) {
    this.event_name = event_name;
    this.event_id = event_id;
    this.event_url = event_url;
    this.no_of_tickets = no_of_tickets;
    this.price = price;
    this.Username = email;
    this.Password = password;
    this.proxy_ = rand_proxy;
    this.proxy_user = this.proxy_.split(":")[2];
    this.proxy_pass = this.proxy_.split(":")[3];
    this.proxy_host = this.proxy_.split(":")[0];
    this.proxy_port = this.proxy_.split(":")[1];
    this.cookies = {};
    this.proxy_server = `http://${this.proxy_host}:${this.proxy_port}`;
    this.threads = [];
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    this.wei = [550, 600, 630, 650, 680, 700, 750, 800, 850, 900];
    this.hei = [700, 650, 680, 720, 750, 780, 800, 630, 650, 850, 900, 950, 920];
    this.geo_locations = [
      '42.46372,1.49129', '42.54277,1.73361', '42.55623,1.53319', '42.50729,1.53414', '42.54499,1.51483', // Andorra
      '24.81089,56.10657', '23.65416,53.70522', '25.33132,56.34199', '25.07725,55.30927', // United Arab Emirates
      '36.52947,71.3441', '31.9848,65.4736', '34.34264,61.74675', '32.84734,68.44573', '33.14641,68.79213', // Afghanistan
      '17.6394,-61.82437', '17.06565,-61.87466', '17.06671,-61.79303', '18.20118,-63.08998', // Antigua and Barbuda
      '49.98001,23.55848', '47.49653,32.34161', '47.26507,36.98016', '51.43762,24.43997', // Ukraine
      '48.59427,27.07487', '46.28873,29.86709', '49.48906,22.96589', '49.59709,27.615', // Belarus
    ];
  }

  async datadomeCaptcha() {
    console.log("ENTRY THE SOLVE DATADOME CAPTCHA FUNC");
    const headers = {
      "authority": "tickets.manutd.com",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-GB,en;q=0.9",
      "cache-control": "max-age=0",
      "sec-ch-ua": '"Google Chrome";v="110", "Chromium";v="110", "Not?A_Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    };

    try {
      const response = await axios.get(this.captcha_url, { headers });
      const challengeHTML = response.data;
      // console.log("CHALLENGE HTML DATA : ",challengeHTML)

      const datadomeResponse = await axios.post('https://datadome.takionapi.tech/solve', { html: challengeHTML }, {
        headers: {
          'x-api-key': API_KEY,
          'User-Agent': headers['user-agent']
        }
      });

      if (datadomeResponse.data.error) {
        console.error(datadomeResponse.data.error);
        process.exit(0);
      }

      const datadomeData = datadomeResponse.data;
      const finalResponse = await axios.post(datadomeData.url, datadomeData.payload, {
        headers: datadomeData.headers
      });
      console.log("DATADOME RESPONSE CHECK : ",finalResponse)
      try{

        const cookie_ = finalResponse.data.cookie.split('datadome=')[1].split('; ')[0];
        console.log(`COOKIE : ${cookie_}`);
        const cookie_set = { name: 'datadome', value: cookie_, path: '/', domain: '.manutd.com' };
        console.log("COOKIE SET : ", cookie_set);
        
        // Add cookie to the page context
        await this.page.context().addCookies([cookie_set]);
        console.log("DATADOME COOKIE ADDED SUCCESSFULLY");
        
        await this.page.reload();
        console.log('Loading page with cookie...');
      }catch(error){
        console.log("ERROR : ", error)
      }

    } catch (error) {
      console.error(`ERROR : ${error.message}`);
    }
  }

  async  queueItSolve() {
    console.log("QUEUE IT SOLVE FUNCTION")
    try {
        // Make a POST request to the API
        const response = await axios.post(
            'https://takionapi.tech/ocr',
            {
                image: this.base64Src
            },
            {
                headers: {
                    'x-api-key': API_KEY
                }
            }
        );

        // Handle response data
        const result = await response.data;
        console.log("RESULT CHECK : ",result.result)
        // Check for error
        if (result.error) {
            console.error(result.error);
            process.exit(0); // Exit the process if there's an error
        }

        // Save image for debugging
        // await promisify(fs.writeFile)('queueit.png', Buffer.from(this.base64Src, 'base64'));

        const capt_out = result.result;
        console.log(`Solved! ${capt_out}`);
        // await this.page.waitForSelector("#solution",{timeout:5000})
        await this.page.fill("#solution", capt_out)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await this.page.click(".botdetect-button",{timeout:8000})
        await new Promise(resolve => setTimeout(resolve, 9000));
        await this.page.reload();

    } catch (error) {
        console.error('Error:', error.message);
    }
}



  async Queue_it() {
    console.log("Queue_it........");
    let checkQueue = false;

    while (!checkQueue) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const window_title = await this.page.title();
      console.log("Window Title ", window_title);

      if (window_title === "manutd.com") {
        console.log("Queue_it..........", this.event_name);
        await this.page.waitForTimeout(4000);

        const htmlcontent = await this.page.content();
        const $ = cheerio.load(htmlcontent);

        const containsTFe = $('body').text().includes("'t':'fe'");
        if (containsTFe) {
          console.log("DATADOME SOLVING CAPTCHA.... ");
          this.captcha_url = $('iframe').attr('src');
          console.log('Source URL of the iframe:', this.captcha_url);
          await this.datadomeCaptcha();
        } else {
          console.log("BLOCKED.......... PLEASE RESTART BOT ");
        }
      }else if (window_title ==='Queue-it'){
        const htmlcontent = await this.page.content();
        const $ = cheerio.load(htmlcontent);
        console.log("QUEUE IT CAPTCHA FOUND ")
        try{

          this.base64Src = $('div.botdetect-label img').attr('src').split("base64,")[1];
          console.log(typeof this.base64Src);
          await this.queueItSolve()
          checkQueue = true
        }catch{
          console.log("You are now in the queue")

        }
      }else{
        console.log("CAPTCHA PAGE NOT FOUND");
        checkQueue = true;
      }
    }
  }
  
  async loginCheck() {
    let done = false;
    while (!done) {
      if (this.page.title() === 'Log-in | MANCHESTER UNITED') {
        console.log('title--> ', this.title);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else if (this.title === 'Queue-it') {
        console.info("queue page found");
      } else {
        done = true;
      }
    }
  }

  async start() {
    console.log(`Launching worker thread for ${this.email}...`);

    try {
      const weight = this.wei[Math.floor(Math.random() * this.wei.length)];
      const height = this.hei[Math.floor(Math.random() * this.hei.length)];
      const random_geo = this.geo_locations[Math.floor(Math.random() * this.geo_locations.length)];
      const [latitude, longitude] = random_geo.split(',');

      const browser = await firefox.launch({
        headless: false,
        proxy: {
          server: this.proxy_server,
          username: this.proxy_user,
          password: this.proxy_pass
        }
      });

      const context = await browser.newContext({
        viewport: { width: weight, height: height }
      });

      this.page = await context.newPage();
      await this.page.goto("https://www.manutd.com/", { waitUntil: 'load' });
      await this.page.goto("https://tickets.manutd.com/en-GB/categories/home-tickets", { waitUntil: 'load' });
      await this.page.waitForTimeout(4000);
      await this.Queue_it();

      console.log("...............................1")

      try {
        await this.page.click("#accept-btn");
      } catch (error) {
        console.error("Accept button not found:", error);
      }
      console.log("...............................2")
      // await this.page.reload()
      await this.page.waitForTimeout(1500);
      if (await this.page.title() === 'Queue-it') {
        await this.Queue_it();
      }
      console.log("...............................3")
      // await this.page.waitForTimeout(1500);
      // await this.page.reload()
      await this.page.waitForTimeout(1500);
      
      let flag = false;
      while(!flag){

        if (await this.page.title() !== 'Queue-it') {
          
          await this.page.goto("https://www.manutd.com/en/SignIn?ret=https://www.manutd.com/en/myunited", { waitUntil: 'load' });
          await this.page.waitForTimeout(2000);
          flag = true;
        }else{
          console.log("UNDEFINED BOLE TO KUCH SAMJH NHI AA RHA ")
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.Queue_it()
        }
      }
      console.log("...............................4")

      await this.loginCheck();

      if (await this.page.title() === 'manutd.com') {
        await this.Queue_it();
      }

      await this.page.waitForTimeout(1000);
      await this.page.waitForSelector("#loginID", { timeout: 10000 });
      await this.page.fill("#loginID", this.Username);
      await this.page.waitForTimeout(2000);
      await this.page.waitForSelector("#password");
      await this.page.fill("#password", this.Password);
      await this.page.waitForTimeout(1000);
      
      try {
        await this.page.waitForSelector("#later", { timeout: 10000 });
        await this.page.click("#later");
        await this.page.waitForTimeout(1000);
      } catch (error) {
        // Ignore error
      }

      try {
        await this.page.waitForSelector(".pf-widget-close", { timeout: 10000 });
        await this.page.click(".pf-widget-close");
        await this.page.waitForTimeout(1000);
      } catch (error) {
        // Ignore error
      }

      try {
          await this.page.waitForSelector("#accept-btn", { timeout: 10000 });
          await this.page.click("#accept-btn");
          await this.page.waitForTimeout(1000);
        } catch (error) {
          // Ignore error
        }
      await this.page.waitForSelector("#gigya-login-form > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > input");
      await this.page.click("#gigya-login-form > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > input");
      await this.loginCheck();
      await this.page.waitForTimeout(3000);

      if (this.page.title()=== "manutd.com" || this.page.title() ==="Queue-it"){
        await this.Queue_it();
      }
      await this.page.waitForTimeout(5000);
      await this.navigate_func()

      console.log(`Scraping completed for ${this.email}.`);
    } catch (error) {
      console.error(`Error in browser thread for ${this.email}:`, error);
    }
  }

  
  async navigate_func() {
    await this.page.goto(this.event_url)

    if (this.page.title()=== "manutd.com" || this.page.title() ==="Queue-it"){
      await this.Queue_it();
    }
    await this.page.waitForSelector("#navMenu_Float_login_item>span", { timeout: 30000 });
    await this.page.click("#navMenu_Float_login_item>span");
    await this.page.waitForTimeout(4000)
    
    let selectorFound = false;
    while (!selectorFound) {
      try {
        await this.page.waitForSelector('#eventPage div.name', { timeout: 5000 });
        selectorFound = true;
        console.log('Selector found!');
      } catch (error) {
        console.log('Waiting for selector...');
      }
    }
    await this.loginCheck()
    await this.page.waitForTimeout(2000);
    await this.Ticket_add_func()
  }


  async Ticket_add_func(){
    console.log("READY FOR WAIT TICKET ADD")
    await this.page.reload()
    await this.page.waitForTimeout(3000)

    try{
      console.log("ALL CLEAR ...........")
      let flag_ticket = false;
      while (!flag_ticket) {
        try{
          
        //   const status = await this.page.evaluate(() =>{
        //     return new Promise((resolve,rejects)=>{
        //       await fetch('https://tickets.manutd.com/handlers/api.ashx/0.1/TicketingController.SetEventTickets', {
        //         method: 'POST',
        //         headers: {
        //           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
        //           'Accept': 'application/json, text/javascript, */*; q=0.01',
        //           'Accept-Language': 'en-US,en;q=0.5',
        //           'Accept-Encoding': 'gzip, deflate, br, zstd',
        //           'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //           'X-Esro-Af': 'XS627kS1sBI=',
        //           'X-Requested-With': 'XMLHttpRequest',
        //           'Origin': 'https://tickets.manutd.com',
        //           'Connection': 'keep-alive',
        //           'Referer': 'https://tickets.manutd.com/en-GB/events/manchester%20united%20legends%20v%20celtic%20legends/2024-9-7_14.00/old%20trafford?hallmap',
        //           'Sec-Fetch-Dest': 'empty',
        //           'Sec-Fetch-Mode': 'cors',
        //           'Sec-Fetch-Site': 'same-origin',
        //           'TE': 'trailers'
        //         },
        //         body: new URLSearchParams({
        //           'eventId': 'c5ade7fd-f7ec-ee11-8444-e05164d7d7e0',
        //           'priceLevels': '["ac20f04f-32d8-eb11-830a-e93bb4498a61","1e3e0d2a-c23a-4f73-8f1e-1a5868d24a0f","023b2a89-26a8-4eec-80b6-301362c70df2","884a032b-daee-4abe-a258-5f485481bae5","6f2720db-8881-4c43-9d8f-6a0bc3ca8571","43c8abd7-1307-4f82-bdd2-e20d00abace7","a2c4a826-35a7-4b98-9375-b43073d39eb3","9048a9af-7584-43e7-8d57-5ef9277fad14","40046f48-d09d-eb11-82e4-d41c3aef1b58","850977f4-cd9d-eb11-82e4-d41c3aef1b58","b6b4495b-d09d-eb11-82e4-d41c3aef1b58","110e1e79-d09d-eb11-82e4-d41c3aef1b58","0537419d-d09d-eb11-82e4-d41c3aef1b58","72215186-d09d-eb11-82e4-d41c3aef1b58","cd660d5e-fbca-4d26-ba6a-33363b24eed5","7a7ad6cc-d09d-eb11-82e4-d41c3aef1b58","9af078fd-1581-eb11-82e4-d8e040011278","fe8e1a52-cd9d-eb11-82e4-d41c3aef1b58","60da4c71-cd9d-eb11-82e4-d41c3aef1b58","5364e5bb-cd9d-eb11-82e4-d41c3aef1b58"]',
        //           'seatsToSet': '[{"SeatCount":1,"PriceTypeGuid":"1bccceb8-f380-eb11-82e4-d8e040011278"}]',
        //           'promoData': '',
        //           'areas': ''
        //         })
        //       });

        //   })
        // })
        const status =  await this.page.evaluate(async()=>{
          const response = await fetch('https://tickets.manutd.com/handlers/api.ashx/0.1/TicketingController.SetEventTickets', {
            method: 'POST',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
              'Accept': 'application/json, text/javascript, */*; q=0.01',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br, zstd',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Esro-Af': 'XS627kS1sBI=',
              'X-Requested-With': 'XMLHttpRequest',
              'Origin': 'https://tickets.manutd.com',
              'Connection': 'keep-alive',
              'Referer': 'https://tickets.manutd.com/en-GB/events/manchester%20united%20legends%20v%20celtic%20legends/2024-9-7_14.00/old%20trafford?hallmap',
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'TE': 'trailers'
            },
            body: new URLSearchParams({
              'eventId': 'c5ade7fd-f7ec-ee11-8444-e05164d7d7e0',
              'priceLevels': '["ac20f04f-32d8-eb11-830a-e93bb4498a61","1e3e0d2a-c23a-4f73-8f1e-1a5868d24a0f","023b2a89-26a8-4eec-80b6-301362c70df2","884a032b-daee-4abe-a258-5f485481bae5","6f2720db-8881-4c43-9d8f-6a0bc3ca8571","43c8abd7-1307-4f82-bdd2-e20d00abace7","a2c4a826-35a7-4b98-9375-b43073d39eb3","9048a9af-7584-43e7-8d57-5ef9277fad14","40046f48-d09d-eb11-82e4-d41c3aef1b58","850977f4-cd9d-eb11-82e4-d41c3aef1b58","b6b4495b-d09d-eb11-82e4-d41c3aef1b58","110e1e79-d09d-eb11-82e4-d41c3aef1b58","0537419d-d09d-eb11-82e4-d41c3aef1b58","72215186-d09d-eb11-82e4-d41c3aef1b58","cd660d5e-fbca-4d26-ba6a-33363b24eed5","7a7ad6cc-d09d-eb11-82e4-d41c3aef1b58","9af078fd-1581-eb11-82e4-d8e040011278","fe8e1a52-cd9d-eb11-82e4-d41c3aef1b58","60da4c71-cd9d-eb11-82e4-d41c3aef1b58","5364e5bb-cd9d-eb11-82e4-d41c3aef1b58"]',
              'seatsToSet': '[{"SeatCount":1,"PriceTypeGuid":"1bccceb8-f380-eb11-82e4-d8e040011278"}]',
              'promoData': '',
              'areas': ''
            })
          });
          const status = response.status;
          const responseText = await response.text();
          return { status, responseText };
        })
        console.log("RESPONSE CHECK ##############################################--------------------: ",status.status)
        // console.log("RESPONSE CHECK --------------------: ",responseText)

        try{
          const seatNo = [];
          for (const i of response){
            const { SectorName, RowName, SeatName, TotalPrice } = i;
            console.log("SECTOR NAME : ",SectorName)
            console.log("ROW NAME : ",RowName)
            // console.log("SEAT NAME : ",SeatName)
            seatNo.push(SeatName);
            const Amount = TotalPrice.Amount;
            console.log("TOTAL PRICE : ",Amount)
            this.cookies = await this.page.context().cookies();
            this.aspNetSessionIdCookie = this.cookies.find(cookie => cookie.name === "ASP.NET_SessionId");
            this.manutdAuth = this.cookies.find(cookie => cookie.name === "manutd_auth");
            this.manuauth = this.manutdAuth.value;
            this.ASP = this.aspNetSessionIdCookie.value;
            this.ticketWithAspUrl = `https://tickets.manutd.com/?nta=${this.manuauth}&ntb=${this.ASP}`;
            console.log(`TICKET WITH ASP URL:---------------------------- ${this.ticketWithAspUrl}`);
            const finalSeatNo = seatNo.join(",");
            console.log("FINAL SEAT NO : ",finalSeatNo)

            console.log("TICKETS HAVE BEEN ADDED REMOVING THE LOOP ")

            try{
              var scrapedData = {
                eventName:this.event_name,
                section:SectorName,
                row:RowName,
                seat:finalSeatNo,
                price:Amount,
                cookie:this.ticketWithAspUrl
              }
              console.log("DICT DATA : ",scrapedData)
            }catch(erro){
              console.log("DATABASE ERROR : ",erro)
            }
            
            const newTicket = new Ticket(scrapedData);
            console.log("NEW TICKET : ",newTicket)
            newTicket.save()
                .then(savedTicket => {
                    console.log('Ticket saved successfully:', savedTicket);
                    // Handle success as needed
                })
                .catch(error => {
                    console.error('Error saving ticket:', error);
                    // Handle error as needed
                });

          }
          await this.page.reload()
            if (await this.page.title()==="manutd.com"){
               await this.Queue_it()
            }else{
              // await this.page.reload();
              flag_ticket = true;
              break;
            }
          // flag_ticket = true;
          // break

        }catch(error){
          await new Promise(resolve => setTimeout(resolve, 3000));
          await this.Queue_it()
          flag_ticket = false
        }
          // const response = await this.page.evaluate(ajaxScript);
          
        }catch(error){
          console.log("INSIDE ERROR TICKET ADD",error)
        }
      }
    }catch(error){
      console.log()
    }
  }
  
}

const data = await fs.readFile('bot/proxy.txt', { encoding: 'utf8' });
const pr = data.trim().split('\n');
console.log("DATA : ", pr);

async function database() {
  const dataFromIndexJs = JSON.parse(process.argv[2]);
  console.log(dataFromIndexJs);

  const scraperPromises = [];

  for (const element of dataFromIndexJs) {
    const event_name = element.event_name;
    const event_id = element.event_id;
    const event_url = element.event_url;
    const no_of_tickets = element.no_of_tickets;
    const price = element.price;
    const active = element.active;
    
    if (active === "YES") {
      console.log("EVENT NAME : ", event_name);
      console.log("EVENT ID : ", event_id);
      console.log("EVENT URL : ", event_url);
      console.log("NO OF TICKETS : ", no_of_tickets);
      console.log("PRICE : ", price);

      const login_row = element.login.split("\n").map(line => line.trim());
      for (const loginline of login_row) {
        const [email, password] = loginline.split(",");
        console.log("EMAIL : ", email);
        console.log("PASSWORD : ", password);
        const rand_proxy = pr[Math.floor(Math.random() * pr.length)];
        console.log("Random proxy : ", rand_proxy);
        const scraper = new Scraper(event_name, event_id, event_url, no_of_tickets, price, email, password, rand_proxy);
        const promise = scraper.start();
        scraperPromises.push(promise);
      }
    } else {
      console.log("Event is not active");
    }
  }

  // Wait for all scraper instances to complete
  await Promise.all(scraperPromises);
}

database();
