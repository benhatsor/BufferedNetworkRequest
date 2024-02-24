
async function BufferedNetworkRequest(request, updateCallback) {
  
  const response = await request;
  
  let respText = '';
  
  const res = new Response(new ReadableStream({
    
    async start(controller) {
      
      const reader = response.body.getReader();
      
      for (;;) {
        
        const {done, value} = await reader.read();
        
        
        if (done) {
          
          updateCallback(null, done);
          
          break;
          
        }
        
        
        const string = new TextDecoder().decode(value);
        
        respText += string;
        
        
        const parser = BufferedNetworkRequest.InvalidJSONParser;
        
        const validData = parser.parse(respText);
        
        updateCallback(validData);
        
      }
      
      controller.close();
      
    }
    
  }));

}

