
const statusEl = document.querySelector('.status');

async function main() {
  
  statusEl.classList.add('loading');
  
  
  let request = fetch('https://api.github.com/user/repos?visibility=all&sort=pushed&per_page=100&page=1', {
    headers: {
      authorization: 'token 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'
    },
    cache: 'no-store',
    method: 'GET'
  });
  
  
  request = await BufferedNetworkRequest(request, { json: true });
    
  request.onupdate = (data) => {
    
    let out = '';
  
    data.forEach(item => {
  
      out += '<p>' + item.name + '</p>';
      
    });
    
    statusEl.innerHTML += out;
    
  };
  
  request.ondone = () => {
    
    statusEl.classList.remove('loading');
    
  };
  
}

main();

