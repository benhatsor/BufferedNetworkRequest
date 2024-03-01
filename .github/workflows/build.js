
const fs = require('node:fs');

const { minify } = require('terser');


const originDir = 'src/';

const orderFileDir = '.scriptorder';

const fileDirs = getOrderArrFromFile(originDir + orderFileDir);


// max file size for Performance budgets = 250000 [bytes]
// if file is over max file size, split it.
// see: https://github.com/webpack/webpack/issues/3216
// and: https://webpack.js.org/configuration/performance/#performancemaxassetsize
const maxFileBytes = 250000;

let textBuffer = '';

let filesToMinify = [];


fileDirs.forEach(fileDir => {
  
  // only minify JS files
  if (!fileDir.endsWith('.js')) return;
  
  fileDir = originDir + fileDir;
  
  
  const fileContent = fs.readFileSync(fileDir, 'utf8');
  
  
  const tempBuffer = textBuffer + fileContent;
  
  const textBytes = getStrBytes(tempBuffer);
  
  if (textBytes > maxFileBytes) {
    
    filesToMinify.push(textBuffer);
    
    textBuffer = fileContent;
    
    const fileBytes = getStrBytes(fileContent);
    
    if (fileBytes > maxFileBytes) {
      
      console.log('[Warning] File "'+ fileDir +'" is over max bytes');
      
    }
    
  } else {
    
    textBuffer = tempBuffer;
    
  }
  
});

// push final buffer to files
filesToMinify.push(textBuffer);


minifyFiles(filesToMinify);


async function minifyFiles(files) {
  
  let nameCache = {};
  
  for (let i = 0; i < files.length; i++) {
    
    const file = files[i];
    
    const result = await minify(file, {
      nameCache: nameCache,
      format: {
        preamble: '/* BufferedNetworkRequest */'
      }
    });
    
    const code = result.code;
    
    
    // create a 'dist' directory if it doesn't exist
    // https://stackoverflow.com/a/13544465
    fs.mkdirSync('dist', { recursive: true });
    
    
    if (files.length === 1) {
      
      // edit the output file or create it if it doesn't exist
      fs.writeFileSync('dist/BufferedNetworkRequest.js', code);
    
    } else {
      
      // edit the output file or create it if it doesn't exist
      fs.writeFileSync('dist/BufferedNetworkRequest.bundle.'+ i +'.js', code);
      
    }
    
  }
  
}


function getOrderArrFromFile(dir) {
  
  let order = fs.readFileSync(dir, 'utf8');
  
  order = order.split('\n');
  
  // trim all elements and remove empty ones
  order = order.flatMap(n => n ? n.trim() : []);
  
  return order;
  
}


// utils

function getStrBytes(str) {
  
  const bytes = (new TextEncoder().encode(str)).length;
  
  return bytes;
  
}

