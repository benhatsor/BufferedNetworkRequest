
async function bufferedNetworkRequest(request, updateCallback) {
  
  const response = await request;
  
  let respText = '';
  
  const res = new Response(new ReadableStream({
    
    async start(controller) {
      
      const reader = response.body.getReader();
      
      for (;;) {
        
        const {done, value} = await reader.read();
        
        if (!done) {
          
          const string = new TextDecoder().decode(value);
          
          respText += string;
          
          
          const validData = InvalidJSONParser.parse(respText);
          
          updateCallback(validData);
          
        } else {
          
          updateCallback(null, done);
          
          break;
          
        }
        
      }
      
      controller.close();
      
    }
    
  }));

}

