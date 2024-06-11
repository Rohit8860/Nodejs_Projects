import fetch from "node-fetch";
import cheerio  from "cheerio";
import { Blog } from "../model.js";
// import xlsx from "xlsx";

// const workbook = xlsx.utils.book_new();

var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Connection': 'keep-alive',
    'Cookie': 'AKA_A2=A; token=9bca2514-6f0a-45ae-8821-cfd5108726c9; uuid=9bca2514-6f0a-45ae-8821-cfd5108726c9; _h_cur_co_inv=de8c397451f34304bbea43a23169b6c6-17171341850253932; productHistory=%7B%22category%22%3A%22Air%20Conditioners%22%2C%22modelNo%22%3A%22HSU18K-PYFR3BN-INV%22%2C%22productUrl%22%3A%22https%3A%2F%2Fwww.haier.com%2Fin%2Fair-conditioners%2Fhaier-15-ton-3-star-kinouchi-triple-inverter-intelli-smart-split-air-conditioner.shtml%22%2C%22productPicUrl%22%3A%22https%3A%2F%2Fimage.haier.com%2Fin%2Fair-conditioners%2FW020240318501773741764_350.jpg%22%7D%3B%7B%22category%22%3A%22Air%20Conditioners%22%2C%22modelNo%22%3A%22HSU18K-PYSS5BN-INV%22%2C%22productUrl%22%3A%22https%3A%2F%2Fwww.haier.com%2Fin%2Fair-conditioners%2Fhaier-15-ton-5-star-kinouchi-hexa-inverter-split-air-conditioner-silver.shtml%22%2C%22productPicUrl%22%3A%22https%3A%2F%2Fimage.haier.com%2Fin%2Fair-conditioners%2FW020240315663566776399_350.jpg%22%7D',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    'Priority': 'u=1'
}


async function list_page() {
    const done = false;
    let count = 1;
    const products = []; // create an array to store all product data
  
    while (!done) {
      const url = `https://www.haier.com/igs/front/overseas_product/getProduct?code=d8a86ae821b646d8b0404ad35591386b&searchWord=(channelId%3D38507)%20and%20(psale%3D1)&pageNo=${count}&pageSize=12&siteId=5&filterJsonUrl=https%3A%2F%2Fwww.haier.com%2Fin%2Fair-conditioners%2Ffilter_es.json&orderBy=docOrderPri%3Adesc%2CdocOrder%3Adesc&filter=&defaultSearch=(channelId%3D38507)%20and%20(psale%3D1)&retFilterJson=yes`
      const response = await fetch(url,{
          headers:headers
      });
      if(response.ok){
          console.log("Response check",response.status)
          const data = await response.json();
          var page = data.page.data
          console.log(typeof page)
  
          for (let i = 0; i < page.length; i++) {
              const len = page[i];
              const price = len.price;
              const productUrl = len.docPubUrl;
              const name = len.pname;
              const model = len.modelno;
              const des = len.ggdesc;
              console.log("NAME : ",name)
              console.log("MODEL : ",model)
              console.log("PRICE : ",price)
              console.log("URL : ",productUrl)
              console.log("DESCRIPTION : ",des)
  
              const productData = {
                Name: name,
                MODEL: model,
                PRICE: price,
                DES: des,
                URL: productUrl
              };
              products.push(productData); // push each product's data to the array
          }
  
      }console.log(products);
  
      if (page.length ===0){
          break;
      }
  
      count +=1
    };
    // if (products.length >0){
    //     const worksheet = xlsx.utils.json_to_sheet(products);
    //     xlsx.utils.book_append_sheet(workbook,worksheet,"Sheet1");
    //     xlsx.writeFile(workbook,"HaierAirConditioner.xlsx");
    //     console.log("Excel fiel Successfully created")
    // }else{
    //     console.log("No data found to write to Excel.")
    // }
  
  }
//   list_page();