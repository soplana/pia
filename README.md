## pia.js

pia.js is a library that supports object-oriented programming in javascirpt.


## sample
```javascript:
var Article = pia.makeClass({

  // constructor
  initialize : function(title){
    this.title = title; // private property
  },

  // public methods
  public : {
    getTitle : function(){
      return this.prefixTitle() + this.title;
    },
    
    prefixTitle : function(){ 
      return "Javascript Library: ";
    }
  }

});

var User = pia.makeClass({

  // constructor
  initialize : function(name){
    this.name = name; // private property
  },

  // public methods
  public : {
    getName : function(){
      return this.makeName();
    },

    setName : function(name){
      return this.name = name;
    }
  },

  // private methods
  private : {
    makeName : function(){
      return this.name.toUpperCase();
    }
  }

});

var article = Article.new("pia.js");
console.log(article.title); // undefined
console.log(article.getTitle()); // Javascript Library: pia.js

var user = User.new("tom");
console.log(user.getName()); // TOM

user.setName("soplana");
console.log(user.getName()); // SOPLANA 

console.log(user.makeName()); // user has no method 'makeName'
```
