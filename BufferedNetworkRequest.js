
async function BufferedNetworkRequest(request, options = {}) {
  
  const response = await request;
  
  let respText = '';
  
  new Response(new ReadableStream({
    
    async start(controller) {
      
      const reader = response.body.getReader();
      
      for (;;) {
        
        const {done, value} = await reader.read();
        
        
        if (done) {
          
          callDoneCb();
          
          break;
          
        }
        
        
        const string = new TextDecoder().decode(value);
        
        respText += string;
        
        
        callUpdateCb(string);
        
      }
      
      controller.close();
      
    }
    
  }));
  
  
  let lastDataLen = 0;
  
  function parseInvalidJSON(data) {
    
    const parser = BufferedNetworkRequest.InvalidJSONParser;
    
    data = parser.parse(respText);
    
    
    const dataLen = data.length;
    
    // remove already-received data
    // from array
    data = data.slice(lastDataLen);
    
    lastDataLen = dataLen;
    
    
    return data;
    
  }
  
  
  let updateCb, doneCb;
  
  function callUpdateCb(data) {
    
    if (!updateCb) return;
    
    if (options.json) {
      
      data = parseInvalidJSON(respText);
      
    }
    
    updateCb(data);
    
  }
  
  function callDoneCb() {
    
    if (!doneCb) return;
    
    let resp = respText;
    
    if (options.json) {
      
      resp = JSON.parse(respText);
      
    }
    
    updateCb(resp);
    
  }
  
  
  const eventObj = {
    
    set onupdate(value) {
      
      updateCb = value;
      
    },
    
    set ondone(value) {
      
      doneCb = value;
      
    }
    
  };
  
  return eventObj;

}

