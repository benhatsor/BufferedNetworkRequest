
const statusEl = document.querySelector('.status');


async function main() {
  
  let request = fetch('https://api.github.com/users/github/repos?per_page=100', {
    cache: 'no-store'
  });
  
  
  const startTime = performance.now();
  let lastTime = startTime;
  let firstLoadTime;
    
  request = await BufferedNetworkRequest(request, { json: true });
  
  request.onupdate = (validData) => {
    
    let out = '';
  
    validData.forEach(item => {
  
      out += '<p>' + item.name + '</p>';
      
    });
    
    statusEl.innerHTML += out;
    
    
    const currTime = performance.now();
    
    if (!firstLoadTime) {
      
      firstLoadTime = currTime;
      
    }
    
    
    let deltaTime = currTime - lastTime;
    deltaTime = +deltaTime.toFixed(2);
    
    statusEl.innerHTML += '<h2>loaded ' + validData.length + ' in +' + deltaTime + 'ms</h2>';
    
    lastTime = performance.now();
      
    
    document.body.scrollTo(0, document.body.scrollHeight);
    
  };
  
  request.ondone = (resp) => {
    
    const currTime = performance.now();
    
    
    let totalRequestTime = currTime - startTime;
    
    let deltaTime = currTime - firstLoadTime;
    
    let deltaPercent = percentage(deltaTime, totalRequestTime);
    
    
    deltaPercent = +deltaPercent.toFixed(2);
    
    deltaTime = deltaTime / 1000; // [ms] to [seconds]
    deltaTime = +deltaTime.toFixed(2);
    
    totalRequestTime = totalRequestTime / 1000; // [ms] to [seconds]
    totalRequestTime = +totalRequestTime.toFixed(2);
    
    
    statusEl.innerHTML += '<h3>done. (loaded '+ resp.length +' objects)</h3><h1>time saved: ' + deltaPercent + '% ('+ deltaTime +'s of '+ totalRequestTime +'s)</h1>';
    
    
    document.body.scrollTo(0, document.body.scrollHeight);
    
  };
  
}

main();


function percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
}

