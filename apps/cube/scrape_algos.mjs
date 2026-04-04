import * as cheerio from 'cheerio';

async function run() {
  const res = await fetch('https://www.speedsolving.com/wiki/index.php/First_Two_Layers');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const algos = [];
  
  $('td').each((i, td) => {
     const img = $(td).find('img[src*="F2L"]');
     if (img.length > 0) {
        const src = img.attr('src');
        const match = src.match(/F2L(?:_)?0?(\d+)/i);
        if (match) {
           const id = parseInt(match[1], 10);
           
           const nextTd = $(td).next('td');
           let text = nextTd.text();
           let lines = text.split('\n').map(s=>s.trim()).filter(s => s.length > 4 && /[ruflxydbRUFLDBwSMExyz']/.test(s));
           
           let finalAlgo = "";
           if (lines.some(l => l.includes('U ') || l.includes('R '))) {
               finalAlgo = lines.find(l => l.includes('U ') || l.includes('R '));
           } else if (lines.length > 0) {
               finalAlgo = lines[0];
           } else {
               const selfText = $(td).text();
               const selfLines = selfText.split('\n').map(s=>s.trim()).filter(s => s.length > 4 && /[RUFLDB]\s/.test(s));
               if (selfLines.length > 0) finalAlgo = selfLines[0];
           }
           
           if (!finalAlgo) finalAlgo = "R U R' U'";
           
           finalAlgo = finalAlgo.replace(/\[\d+\]/g, '').replace(/\(\d+f\)/gi, '').trim();
           
           if (!algos.some(a => a.id === id)) {
               algos.push({ id, algo: finalAlgo });
           }
        }
     }
  });
  
  algos.sort((a,b) => a.id - b.id);
  console.log(JSON.stringify(algos, null, 2));
}
run();
