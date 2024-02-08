
// gets valid data from invalid JSON

class InvalidJSONParser {
  
  parse(str) {
    
    let objNestingCounter = 0;
    let lastValidIndex = (str.length - 1);
    
    for (let i = 0; i < str.length; i++) {
      
      const char = str[i];
      
      if (char === '{') {
        
        objNestingCounter++;
        
      }
      
      if (char === '}') {
        
        objNestingCounter--;
        
        if (objNestingCounter === 0) {
          
          lastValidIndex = i;
          
        }
        
      }
      
    }
    
    
    let validStr = str;
    
    // if didn't close all objects
    if (objNestingCounter !== 0) {
      
      // get the string up to the last valid index
      validStr = str.slice(0, lastValidIndex);
      
    }
    
    
    // if there's an unclosed top-level array
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

