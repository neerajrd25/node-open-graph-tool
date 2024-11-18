# A Simple node app the extract Open Graph Tags (og:*)

## System Requirements & Run Instruitons

- Node 20.*
- `npm install`
- `npm start`

#### Entry file is `index.js`

Input to Program

url [required]
timeout[optional]

### Description

It Downloads the url provided as input into a string and then parses it find the meta tags with property set as `og.*`
If found returns the og protocol data as `json` and store it as a file

Read More About Graph Here [Open Graph](https://ogp.me)
