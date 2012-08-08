## pia.js

pia.js is a library that supports object-oriented programming in javascirpt.


## current version
v0.0.2


## sample

### public/private  

```javascript:
var Library = $class({

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


### extend 

```javascript:
var User = $class({
  initialize : function(){
    this.name = "guest user";
  },

  public : {
    signIn : function(prefix){
      return (prefix || "welcome") + " " + this.name;
    }
  },

  private : {
    message : function(isAdmin){
      return isAdmin ? "admin user" : "guest user";
    }
  }
});

var AdminUser = $class({
  initialize : function(name, pass){
    this.name = name;
    this.pass = pass;
  },

  public : {
    signIn : function(){
      if(this.pass === 1234)
        return $super("hello");
      else
        return "could not sign in";
    },

    isAdmin : function(){
      return this.message(true);
    }
  }
}).extend(User);

var GuestUser = $class({
  public : {
    isAdmin : function(){
      return this.message(false);
    }
  }
}).extend(User);


var adminUser = AdminUser.new("soplana", 1234);
console.log( adminUser.isAdmin() );                    // admin user 
console.log( adminUser.signIn()  );                    // hello soplana 
console.log( AdminUser.new("soplana", 123).signIn() ); // could not sign in 

var guestUser = GuestUser.new();
console.log( guestUser.isAdmin() );                    // guest user 
console.log( guestUser.signIn()  );                    // welcome guest user 
```


## test

```
$ mocha test/pia.js 
```
