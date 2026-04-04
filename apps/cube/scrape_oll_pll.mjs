import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function scrapeOLL() {
  const res = await fetch('https://www.speedsolving.com/wiki/index.php/OLL');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const ollObj = {};
  $('td').each((i, td) => {
    const $td = $(td);
    const nextTd = $td.next('td');
    if (!nextTd.length) return;
    
    // Look for image alt or src containing OLL XX
    const imgTag = $td.find('img');
    const imgSrc = imgTag.attr('src') || '';
    const imgAlt = imgTag.attr('alt') || '';
    
    // Try to find the exact ID (1-57)
    let match = imgSrc.match(/OLL_?0?(\d+)/i) || imgAlt.match(/OLL_?0?(\d+)/i);
    
    if (!match) {
        // sometimes the text in the cell itself says "OLL 1"
        match = $td.text().match(/OLL\s*0?(\d+)/i);
    }

    if (match) {
       const id = parseInt(match[1]);
       if (id >= 1 && id <= 57) {
           const algos = nextTd.text()
               .split('\n')
               .map(s => s.replace(/\[\d+\]/g, '').replace(/\(.*?\)/g, '').split('//')[0].trim())
               .filter(s => s.length > 5 && /[RULDFB]/i.test(s));
           
           if (algos.length > 0 && !ollObj[id]) {
               ollObj[id] = algos[0]; 
           }
       }
    }
  });
  return ollObj;
}

async function scrapePLL() {
  const res = await fetch('https://www.speedsolving.com/wiki/index.php/PLL');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const pllObj = {};
  $('td').each((i, td) => {
    const $td = $(td);
    const nextTd = $td.next('td');
    if (!nextTd.length) return;

    let alias = null;
    let bText = $td.find('b').text();
    let imgAlt = $td.find('img').attr('alt') || '';
    
    let m = bText.match(/^([A-Za-z]{1,2})\s*Perm/i) || imgAlt.match(/^PLL\s*([A-Za-z]{1,2})/i) || imgAlt.match(/^([A-Za-z]{1,2})\.png/i);
    
    if (m) {
        alias = m[1];
    } else {
        m = $td.text().match(/^\s*([A-Za-z]{1,2})\s*-/);
        if(m) alias = m[1];
    }

    if (alias) {
        alias = alias.toLowerCase();
        // standard valid plls
        if (['aa','ab','e','f','ga','gb','gc','gd','h','ja','jb','na','nb','ra','rb','t','ua','ub','v','y','z'].includes(alias)) {
           const algos = nextTd.text()
               .split('\n')
               .map(s => s.replace(/\[\d+\]/g, '').replace(/\(.*?\)/g, '').split('//')[0].trim())
               .filter(s => s.length > 5 && /[RULDFBME]/i.test(s));
               
           if (algos.length > 0 && !pllObj[alias]) {
               pllObj[alias] = algos[0];
           }
        }
    }
  });
  return pllObj;
}

async function run() {
   console.log("Scraping started...");
   const oll = await scrapeOLL();
   const pll = await scrapePLL();
   
   console.log(`Found OLL algos: ${Object.keys(oll).length}`);
   console.log(`Found PLL algos: ${Object.keys(pll).length}`);
   
   fs.writeFileSync('output_algos.json', JSON.stringify({ oll, pll }, null, 2));
}

run().catch(console.error);
