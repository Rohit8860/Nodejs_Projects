import { exec } from 'child_process';
import CDP from 'chrome-remote-interface';
import express from 'express';

const chromePath = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`;    // path to chrome.exe
const userDataDir = `"C:\\chrome-profile"`;
const port = 9222;


const chromeProcess = exec(`${chromePath} --remote-debugging-port=${port} --user-data-dir=${userDataDir} --disable-gpu`, (error) => {
    if (error) {
        console.error('Chrome launch failed:', error);
    }
});

chromeProcess.stdout?.on('data', (data) => console.log(`Chrome: ${data}`));
chromeProcess.stderr?.on('data', (data) => console.error(`Chrome Error: ${data}`));

const app = express();
const PORT = 3000;


app.get('/scrape', async (req, res) => {
    const business = req.query.business;
    if (!business) {
        return res.status(400).json({ error: ' Business name is required.' });
    }

    try {
        const data = await scrapeReviews(business);
        if (data.error) {
            return res.status(404).json({ error: data.error });
        }
        res.json(data);
        console.log("DATA SUCCESSFULLY SCRAPE ");
    } catch (error) {
        console.error(' Scraping failed:', error);
        res.status(500).json({ error: ' Internal server error. Please try again later.' });
    }
});

async function scrapeReviews(business) {
    let client;
    try {
        client = await CDP();
        const { Page, Runtime } = client;
        await Promise.all([Page.enable(), Runtime.enable()]);

        const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(business)}`;
        console.log(`Search The Name for: ${business}`);
        await Page.navigate({ url: searchUrl });
        await Page.loadEventFired();

        
        const pageContent = await Runtime.evaluate({ expression: `document.body.innerText` });  // Check if Business is Not Found
        if (pageContent.result.value.includes("No results found") || pageContent.result.value.includes("Your search did not match any locations")) {
            return { error: ` No results found for "${business}". Please check the name and try again.` };
        }

        
        const isReviewButtonAvailable = await waitForSelector(Runtime, 'button[aria-label^="Reviews for"]');   // Check and Click Review Button
        if (!isReviewButtonAvailable) {
            return { error: ` Reviews button not found for "${business}".` };
        }
        await Runtime.evaluate({ expression: `document.querySelector('button[aria-label^="Reviews for"]')?.click();` });
        await new Promise(resolve => setTimeout(resolve, 5000));

        
        if (!(await waitForSelector(Runtime, '.fontDisplayLarge'))) {                      // Extract Rating
            return { error: ` Rating not found for "${business}".` };
        }
        const rating = await Runtime.evaluate({
            expression: `document.querySelector('.fontDisplayLarge')?.textContent.trim();`
        });

        
        if (!(await waitForSelector(Runtime, '.jANrlb .fontBodySmall'))) {
            return { error: ` Total reviews count not found for "${business}".` };   // Extract Total Reviews
        }
        const total_review = await Runtime.evaluate({
            expression: `document.querySelector('.jANrlb .fontBodySmall')?.textContent.trim().split(" ")[0];`
        });

       
        for (let i = 0; i < 30; i++) {    // Scroll to Load More Reviews
            await Runtime.evaluate({
                expression: `document.querySelector(".m6QErb.DxyBCb.kA9KIf.dS8AEf")?.scrollBy(0, 1000)`  
            });
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (!(await waitForSelector(Runtime, '.jftiEf.fontBodyMedium', 15000))) {
            return { error: ` Reviews not found for "${business}".` };
        }

        const result = await Runtime.evaluate({
            expression: `(() => {
                const reviews = [...document.querySelectorAll('.jftiEf.fontBodyMedium')];
                return JSON.stringify(reviews.slice(0, 50).map(review => ({
                    username: review.querySelector('.d4r55')?.textContent.trim() || 'Unknown',
                    datetime: review.querySelector('.rsqaWe')?.textContent.trim() || 'Unknown',
                    rating: review.querySelector('.kvMYJc')?.getAttribute('aria-label') || 'Unknown',
                    body: review.querySelector('.wiI7pd')?.textContent.trim() || 'No review text'
                })));
            })()`
        });

        const scrapedData = result.result.value ? JSON.parse(result.result.value) : [];

        
        return {
            averageRating: parseFloat(rating.result.value) || 0,  
            totalReviews: parseInt(total_review.result.value.replace(/\D/g, "")) || 0,
            latestReviews: scrapedData || []
        };

    } catch (error) {
        console.error(' Scraping failed:', error);
        return { error: ' Scraping failed due to Google Maps changes or bot detection. Try again later.' };
    } finally {
        if (client) {
            await client.close();
        }
    }
}


async function waitForSelector(Runtime, selector, timeout = 15000) {  // Helper Function to Wait for Elements
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const result = await Runtime.evaluate({ expression: `document.querySelector('${selector}') !== null` });
        if (result.result.value) return true;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false;
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
