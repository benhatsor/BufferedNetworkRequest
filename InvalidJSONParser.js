
// gets valid data from invalid JSON

class InvalidJSONParser {
  
  parse(str) {
    
    let objNestingCounter = 0;
    let lastValidIndex;
    
    for (let i = 0; i < str.length; i++) {
      
      const char = str[i];
      
      if (char === '{') {
        
        if (objNestingCounter === 0) {
          
          lastValidIndex = (i - 1);
          
        }
        
        objNestingCounter++;
        
      }
      
      if (char === '}') {
        
        objNestingCounter--;
        
      }
      
    }
    
    
    let validStr = str;
    
    // if didn't close all objects
    if (objNestingCounter !== 0) {
      
      // get the string up to the last valid index
      validStr = str.slice(0, lastValidIndex);
      
    } else {
      
      lastValidIndex = (str.length - 1);
      
    }
    
    
    // if there's an unclosed top-level array
    
    validStr = validStr.trim();
    
    if (validStr.startsWith('[') &&
        !validStr.endsWith(']')) {
      
      // if the string ends with a comma,
      // remove it
      if (validStr.endsWith(',')) {
        
        validStr = validStr.slice(0, -1);
        
      }
      
      // close the top-level array
      validStr += ']';
      
    }
    
    
    const validData = JSON.parse(validStr);
    
    return { validData, lastValidIndex };
    
  }
  
}

InvalidJSONParser = new InvalidJSONParser();

