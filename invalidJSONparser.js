
// gets valid data from invalid JSON

class InvalidJSONParser {
  
  parse(str) {
    
    let objNestingCounter = 0;
    let lastValidIndex = 0;
    
    str.forEach(char => {
            
      if (char === '{') {
        
        objNestingCounter++;
        
      }
      
      if (char === '}') {
        
        objNestingCounter--;
        
        if (objNestingCounter === 0) {
          
          lastValidIndex = i;
          
        }
        
      }
      
    });
    
    
    let validStr = str;
    
    // if didn't close all objects
    if (objNestingCounter !== 0) {
      
      // get the string up to the last valid index
      validStr = str.slice(0, lastValidIndex);
      
    }
    
    
    // if there's an unclosed top-level array
    if (validStr.startsWith('[') &&
        !validStr.endsWith(']')) {
      
      // close it
      validStr += ']';
      
    }
    
    
    const validData = JSON.parse(validStr);
    
    return { validData, lastValidIndex };
    
  }
  
}

InvalidJSONParser = new InvalidJSONParser();

