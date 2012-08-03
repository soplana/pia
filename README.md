## pia.js

pia.js is a library that supports object-oriented programming in javascirpt.


## sample

```javascript:
var Library = pia.makeClass({

  // constructor
  initialize : function(name){
    this.name = name; // private instance property
  },

  // public instance methods
  public : {
    getName : function(){
      return this.prefix() + this.makeName();
    },
    
    setName : function(name){
      return this.name = name;
    },
    
    prefix : function(){ 
      return "Javascript Library: ";
    }
  },
  
  // private instance methods
  private : {
    makeName : function(){
      return this.name.toUpperCase();
    }
  },

  // class method
  self : {
    // public class method
    public : {
      libraryName : function(){
        return "pia" + this.extension();
      }
    },
    // private class method
    private : {
      extension : function(){
        return ".js";
      }
    },
  }
});


console.log( Library.libraryName() ); // pia.js

var library = Library.new("pia.js");

console.log( library.name );          // undefined
console.log( library.getName() );     // Javascript Library: PIA.JS 

library.setName("jquery");

console.log( library.getName() );     // Javascript Library: JQUERY 
console.log( library.makeName() );    // library has no method 'makeName'
```


## test

```
$ mocha test/pia.js 
```
