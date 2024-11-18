import  TinyScraper from "./tiny-scraper.js";

// const url = 'https://www.ndtv.com';
const url= 'https://scrapfly.io/blog/web-scraping-with-nodejs/';
// const url = 'fdfdf';
const scraper = new TinyScraper(url, 1);

scraper.on('scrapeStarted', (data) => {
  
  console.log('Scrapping Started at : ', data);

});

scraper.on('scrapeSuccess', (data) => {
  console.log('JSON Data received:', data);
});



scraper.on('error', (message) => {
  console.log('The URL is not valid. ',message );
});


scraper.on('timeout', (data ) => {
  console.log('Scraping timed out : ', data);
});
// client driven call, as scrapper object needs to be fully created to listen to events 
scraper.startScrapping();

// console.log(scraper)

// scraper.emit('scrape', url)

