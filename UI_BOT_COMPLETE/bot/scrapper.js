
import fetch from "node-fetch";
import cheerio  from "cheerio";
import { Blog } from "../model.js";
import { Ticket } from "./model.js";
import mongoose from "mongoose";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { devices, firefox } from 'playwright';
import { Worker, isMainThread, parentPort } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from "node:fs/promises";



// mongoose.connect(
//   "mongodb://localhost:27017/", 
//   {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//   }
// );

console.log("BOT........")


// async function test(){
//   const response = await fetch('https://tickets.manutd.com/handlers/api.ashx/0.1/TicketingController.SetEventTickets', {
//     method: 'POST',
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
//       'Accept': 'application/json, text/javascript, */*; q=0.01',
//       'Accept-Language': 'en-US,en;q=0.5',
//       'Accept-Encoding': 'gzip, deflate, br, zstd',
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//       'X-Esro-Af': 'vwaiZPXp9y8=',
//       'X-Requested-With': 'XMLHttpRequest',
//       'Origin': 'https://tickets.manutd.com',
//       'Connection': 'keep-alive',
//       'Referer': 'https://tickets.manutd.com/en-GB/events/manchester%20united%20v%20liverpool/2024-8-31_15.00/old%20trafford?hallmap',
//       'cookie': 'gid=mv4El8ci5EWoGqmpkd8hAw==; af=fVaXvpzkJYE%3d; QueueITAccepted-SDFrts345E-V3_restofthesite=EventId%3Drestofthesite%26RedirectType%3Dsafetynet%26IssueTime%3D1719986498%26Hash%3De891a192ce2943f7ea51ee8c4ba73dea6c0f3e66f8dbde5f9b0c316e6de7d0f5%26Hip%3D4d9119f1ef0671a9e7bcfd57416a6c14b0bc0940654c93b6fe7317c7a75a4903; ASP.NET_SessionId=eocxhlq231edcqcw02lj2qki; inMobile=false; cvvid=96417fc161bf408583e0327fc49b6d41; cvsid=25ce50c5d0994e898e0699810d94611f_1719986499927; userConsentCookiePolicy=on; _cs_mk_aa=0.49091189720500394_1719986501777; _cs_c=0; AMCVS_247646CB57C0095E7F000101%40AdobeOrg=1; _gcl_au=1.1.2028597040.1719986502; s_cc=true; _pin_unauth=dWlkPVpXSmlNRFExTm1NdFl6VmhaUzAwTUdZeExUbGhPREF0WW1ReE5XWmhZelkxTkRnMg; _fbp=fb.1.1719986502145.278308251432954935; AMCV_247646CB57C0095E7F000101%40AdobeOrg=179643557%7CMCIDTS%7C19908%7CMCMID%7C60784103806544378550193788388856458537%7CMCAAMLH-1720591301%7C12%7CMCAAMB-1720591301%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1719993702s%7CNONE%7CMCAID%7CNONE%7CMCSYNCSOP%7C411-19915%7CvVersion%7C5.5.0; _scid=a4d9cddb-4867-41ee-b9c3-7dbb6628a82b; _ScCbts=%5B%5D; _sctr=1%7C1719945000000; lastVisitedCategory=https%3A%2F%2Ftickets.manutd.com%2Fen-GB%2Fcategories%2Fhome-tickets; s_nr30=1719986872891-New; gig_bootstrap_3_qF2rIOImySC7iiGYz1cYJl9bIg2nWvFOaBkQSK1MSMYb5KanzKCbl5VvcKbDMFGd=account_ver4; manutd_auth=B9263A4255BF8E840A92E342F7B20FC85BA054886ADFAF435DF0560C63ABB949; gac_3_qF2rIOImySC7iiGYz1cYJl9bIg2nWvFOaBkQSK1MSMYb5KanzKCbl5VvcKbDMFGd=st2.s.AtLtvRDj3Q.lnQPO-afnfNjnnRzD2T-OHbwNc1R5Puln1RMTL41E-tqgUz-2EchYoc_44im5oFVJXPp6Jx5CbB2_R6APQZE4i9oJbEFz9e_C1q2FoG2Pzh6ES5IBvabNe8d2lOFyms5.5diAfkqpIscgWtiMP7bX4NLTRXMoP7wViRymOEECgHcgCiDG6u_eAv8nsF9ep1S_dYW7z5sv-lQpkJilRT8Qfg.sc3; g_uid=62b00313e3f545ecacf7e192fe3c069b; BNES_manutd_auth=A5odYooq2lLFb2+y8UmAgWrHLBLlnwLhnrYz20tg6jDhrWY6+KRNpAlffDUVUms8WzoSbO98Di8taw5eYzQ41AbospzBhKMKRLbFO6JbUtwQ+O3lp4HEsqNxqtRnHmun1ITm9eSSbWlyBu859odRcg==; BNES_gac_3_qF2rIOImySC7iiGYz1cYJl9bIg2nWvFOaBkQSK1MSMYb5KanzKCbl5VvcKbDMFGd=b15UbFkB5eLmFWVhDRlu8cJddiVVwf9bmHcb9SZKIrFu/lc5uqbu+NrY8KvNVtBTLXNd97ZT6COJWeymIiTMqT/Txp+KXJlg3QZ5H4c45x/Q++kzfIVxDUWwubxGEQUZJv9zYjcB7UIkSnCfyI4kd/bt4kQPLKWNytwrsavGuMUzo61lF9zGC+b81aZ+HYtNjliPNrYsIEtbKxcOLYHxUHLQgcuROAQ11Dj49BVZPUGAeHcMS404VHgjVLg6D4mEEsHlx2jqcC8NoknmpDBc19gU3FcRRKSDJWQSOCX9EMvzTd5MJaLavHp2S6CyJhPGjxBNqs0MEXCRvNHSN2FTjG2qlsqn1GhB6Y7bn/I+Dy8yOaH4xSBX74r3HrvTmpG70XxLzoYwFh2t2iPTMH1o08YbUyJMhjlEGRm70seOx8It8T9gVD4E74I6/4oD6xDn3BuXpfpTQHA=; BNES_g_uid=QkDazqIVS6pzsXjOn6wFaFEP8KZhr7yKPWAWvT4M+rumdUvZLF5U/tljB9KJrPGEbpX82LUGPMPavKarZsxkpFZE5A9OvezD; cs=RmLrhr4GxzNiH1z3fbVYp4NE; QueueITAccepted-SDFrts345E-V3_allticketsqueue=EventId%3Dallticketsqueue%26RedirectType%3Dsafetynet%26IssueTime%3D1719986927%26Hash%3D76feabedf2d3b4251b92f489e9f90725f9f7710df386f548bb1f5d4e0ccdddaa%26Hip%3D4d9119f1ef0671a9e7bcfd57416a6c14b0bc0940654c93b6fe7317c7a75a4903; _scid_r=a4d9cddb-4867-41ee-b9c3-7dbb6628a82b; _uetsid=b82f6b10390111efb46ba17c00be8df4; _uetvid=b82f9a40390111efa6178b1cf2563156; _cs_id=f773b5ca-cd03-a66a-f8f0-fa052318beeb.1719986501.1.1719986929.1719986501.1.1754150501883.1; _cs_s=4.5.0.1719988729334; s_sq=%5B%5BB%5D%5D; AWSALB=RXrMXVeFmndEiIecCHQ80CZZO3NDJnhVMl2NsZcMV5n5Olp3X1C4WBIj9Ats8ckMJiBIknzyValwkk/5oidaMn6KNXCkgUv2oce1+qpdcva3aXBeAifQJnm2gBH7; AWSALBCORS=RXrMXVeFmndEiIecCHQ80CZZO3NDJnhVMl2NsZcMV5n5Olp3X1C4WBIj9Ats8ckMJiBIknzyValwkk/5oidaMn6KNXCkgUv2oce1+qpdcva3aXBeAifQJnm2gBH7; datadome=jYiLrdxOnvmAEXlSQPzdws2HCkn~s9~nIYus4tH~jmr0KvVImt5BJW7o8j~0tvjkr3qsfWnafrDpP6F4Dt0LHNrhwez6huHjt03t3LCL6Rt~RcWUtAodZoiFYMEuQu3s',      'Sec-Fetch-Dest': 'empty',
//       'Sec-Fetch-Mode': 'cors',
//       'Sec-Fetch-Site': 'same-origin',
//       'TE': 'trailers'
//     },
//     body: new URLSearchParams({
//       'eventId': '41ecd4e4-9216-ef11-8498-86cab58c64c7',
//       'priceLevels': '["a19fb4bc-fb80-eb11-82e4-d8e040011278","9ea99413-77ea-ed11-842f-9f4a468f81fe","98e94ff0-1cfb-ed11-8444-a25587269a4e","025d792d-580a-ec11-8315-9e83fddb9d4c","d880b733-71f9-ed11-8444-fea390947253"]',
//       'seatsToSet': '[{"SeatCount":1,"PriceTypeGuid":"1bccceb8-f380-eb11-82e4-d8e040011278"}]',
//       'promoData': '',
//       'areas': '["9f192556-909d-441c-a5b1-de344894e52b","0dcabff6-8ac6-4015-977b-7e27dba718a9","4f1a2829-5d61-437d-868d-1e08897f4737","c04c2d10-6f41-4f07-a4a8-28eccd6932dc","a98299b6-5288-4494-89bd-304354f3ceeb","ade56aaa-5445-4c7f-832b-1025ba2efca1"]'
//     })
//   });
//   if(response.ok){
//     console.log(response.status)
//     console.log(await response.json())
//   }else{
//     console.log(response.status)
//   }
// }test();



class Scraper {
  constructor(event_name, event_id, event_url, no_of_tickets, price, email, password,rand_proxy) {
    this.event_name = event_name;
    this.event_id = event_id;
    this.event_url = event_url;
    this.no_of_tickets = no_of_tickets;
    this.price = price;
    this.email = email;
    this.password = password;
    this.proxy_ = rand_proxy
    this.proxy_user = this.proxy_.split(":")[2]
    this.proxy_pass = this.proxy_.split(":")[3]
    this.proxy_host = this.proxy_.split(":")[0]
    this.proxy_port = this.proxy_.split(":")[1]
    console.log("User ",this.proxy_user)
    console.log("Pass ",this.proxy_pass)
    console.log("Host ",this.proxy_host)
    console.log("Port ",this.proxy_port)
    this.cookies = {};


    this.proxy_server = `http://${this.proxy_host}:${this.proxy_port}`
    console.log("Proxy Server --------------------------------",this.proxy_server)

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

  async start() {
    console.log(`Launching worker thread for ${this.email}...`);
  
    try {
      const weight = this.wei[Math.floor(Math.random() * this.wei.length)];
      const height = this.hei[Math.floor(Math.random() * this.hei.length)];
      const random_geo = this.geo_locations[Math.floor(Math.random() * this.geo_locations.length)];
      
      const [latitude, longitude] = random_geo.split(',');
  
      const browser = await firefox.launch({
        headless: false,
        proxy:{
          server: this.proxy_server,
          username: this.proxy_user,
          password: this.proxy_pass
        }
      });
      
      const context = await browser.newContext({
        viewport: { width: weight, height: height },
        // geolocation: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        // permissions: ['geolocation'],
      });
  
      this.page = await context.newPage(); 
  
      await this.page.goto(this.event_url);

      const pageTitle = await this.page.title();
      console.log('Page title:', pageTitle);
  
      await this.page.waitForTimeout(2000);
      
      await this.navigate_func();
  
  
      parentPort.postMessage(`Scraping completed for ${this.email}.`);
    } catch (error) {
      console.error(`Error in browser thread for ${this.email}:`, error);
    }
  }
  
  async navigate_func() {
    try {
      console.log("NOW ENTRY NAVIGATE FUNC : ")
      await this.page.goto('https://www.eticketing.co.uk/arsenal')
      await this.page.waitForTimeout(5000);
      const cookies = await this.page.context().cookies();
      // console.log("COOKIES : ", cookies)
      cookies.forEach(element=>{
        const key = element.name;
        const value = element.value;
        this.cookies[key] = value
        // console.log("KEY : ", key, "VALUE : ", value)
      })
      console.log("FINAL COOKIES : ",this.cookies)


      await this.page.goto('https://www.eticketing.co.uk/arsenal/Authentication/Login')

    } catch (error) {
      console.error(`Navigate function error:`, error);
    }
  }
  




}






const data = await fs.readFile('bot/proxy.txt', { encoding: 'utf8' })
const pr = data.trim().split('\n');
console.log("DATA : ",pr)

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
    const active = element.active
    console.log("CHECK ACTIVATE : ",active)
    if(active === "YES"){
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
        console.log("random proxy : ",rand_proxy)
        const scraper = new Scraper(event_name, event_id, event_url, no_of_tickets, price, email, password,rand_proxy);
        const promise = scraper.start();
        scraperPromises.push(promise);
      }

    }else{
      console.log("NOT HAVE ACTIVE EVENT ")
    }
  }

  // Wait for all scraper instances to complete
  await Promise.all(scraperPromises);
}

database();
