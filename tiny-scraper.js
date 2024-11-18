import EventEmitter from 'node:events';
import https from 'https'
import fs from 'fs'
import { JSDOM } from 'jsdom';
// import { AbortController } from 'node:abort-controller';


class TinyScraper extends EventEmitter {

  constructor(address, timeout = 2000) {
    super();
    this.url = address;
    this.timeout = timeout;
  }


  async startScrapping() {
    // const controller = new AbortController();
    // const { signal } = controller;

    const timeoutId = setTimeout((signal) => {
      console.error('Sending Scrapping timeout........');
      // TODO: Fix Controller to abort in case of timeout
      //controller.abort(); // Abort the request
      this.emit('timeout : ', new Date().toLocaleTimeString())
    }, this.timeout); // Set the timeout duration (default is 2000 ms)
    try {

      this.emit("scrapeStarted", new Date().toLocaleTimeString());
      const html = await this.download((data) => data);
      const dom = this.parse(html);
      const obj = this.extract(dom);
      await this.store(obj);

      clearTimeout(timeoutId); // Clear the timeout when scraping is successful
      this.emit('scrapeSuccess', obj)
      console.info('Task completed at ', new Date().toLocaleTimeString())
    } catch (err) {
      // console.log('error catched ', err);
      this.emit('error', err.message)
    }
  }
  async download() {
    // using promise to return the html from inside of the asynchronous task
    return new Promise((resolve, reject) => {
      const request = https.get(this.url, (res) => {
        console.info('---Download Started----');

        // let download = fs.createWriteStream('index.html');
        // res.pipe(download);
        let html = '';

        res.on('data', (chunk) => {
          html += chunk;
        });
        res.on('end', () => {
          console.info('---Download completed----');
          // return html;
          resolve(html)

        });
        // Handle request-level errors
        request.on('error', (err) => {
          console.error('Request error:', err);
          reject(err); // Pass the error to the callback
        });
        res.on('error', (err) => {
          console.error('Error during download:', err);
          reject(err); // Pass the error to the callback
        });

      });

      request.end();
    });
  }
  parse = (htmlData) => (new JSDOM(htmlData));

  extract(dom) {
    console.info('---Extract Started----');
    const ogTags = {};
    const { window: { document } } = dom;

    const metas = document.querySelectorAll('meta');
    
    for (let tag of metas) {
      if (tag.hasAttribute('property') && tag.getAttribute('property')?.startsWith('og:')) {
        const property = tag.getAttribute('property').replace('og:', '');
        const content = tag.getAttribute('content');
        ogTags[property] = content;
      }
    }
    console.info('---Extract Completed----');
    return ogTags;
  }
  async store(tags) {
    fs.writeFile('scrapper.json', JSON.stringify(tags), (err) => {
      if (err) throw err;
      console.info('Scrapping Completed, Notifying Clients');
    })
  }
}

export default TinyScraper;