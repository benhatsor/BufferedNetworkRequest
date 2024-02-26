
const statusEl = document.querySelector('.status');

async function main() {
  
  statusEl.classList.add('loading');
  
  
  let request = fetch('https://api.github.com/users/github/repos?per_page=100', {
    cache: 'no-store'
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

