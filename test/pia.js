var assert = require("assert")
require("../pia")

describe('instance method', function(){
  var user = null;
  before(function(){
    var User = $class({
      initialize : function(name){
        this.name = name;
      },
      public : {
        getName : function(){
          return this.makeName();
        },
        setName : function(name){
          return this.name = name;
        }
      },
      private : {
        makeName : function(){
          return this.name.toUpperCase();
        }
      }
    });
    user = User.new('pia');
  });

  it('name property should be private property', function(){
    assert.equal(undefined, user.name);
  });

  it('getName() should be public method', function(){
    assert.equal("PIA", user.getName());
  });

  it('setName() should be public method', function(){
    user.setName("new user");
    assert.equal("NEW USER", user.getName());
  });

  it('makeName() should be private method', function(){
    var error = null;
    try{
      user.makeName();
    }catch(e){
      error = e;
    }
    assert.equal(true, error instanceof TypeError);
  });

  it('getName() should be instance method', function(){
    var error = null;
    try{
      User.makeName();
    }catch(e){
      error = e;
    }
    assert.equal(true, error instanceof ReferenceError);
  });
});

describe('class method', function(){
  var User = null;
  before(function(){
    User = pia.makeClass({
      self : { 
        public : {
          getName : function(){
            return this.makeName();
          },
          setName : function(name){
            return this.name = name;
          }
        },
        private : {
          makeName : function(){
            return this.name || "user";
          }
        }
      }
    });
  });

  it('name property should be private property', function(){
    assert.equal(undefined, User.name);
  });

  it('getName() should be public method', function(){
    assert.equal("user", User.getName());
  });

  it('setName() should be public method', function(){
    User.setName("new user");
    assert.equal("new user", User.getName());
  });

  it('makeName() should be private method', function(){
    var error = null;
    try{
      User.makeName();
    }catch(e){
      error = e;
    }
    assert.equal(true, error instanceof TypeError);
  });
});

describe('extend', function(){
  var AdminUser = null;
  var adminUser = null;
  var GuestUser = null;
  var guestUser = null;
  before(function(){
    var User = pia.makeClass({
      initialize : function(){
        this.name = "guest user";
      },
      public : {
        signIn : function(prefix){
          return (prefix || "welcome") + " " + this.name;
        },
        getName : function(prefix){
          return this.name;
        }
      },
      private : {
        message : function(isAdmin){
          return isAdmin ? "admin user" : "guest user";
        }
      }
    });
    AdminUser = pia.makeClass({
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
        isAdmin : function(unko){
          return this.message(true);
        }
      }
    }).extend(User);
    GuestUser = pia.makeClass({
      public : {
        isAdmin : function(chinko){
          return this.message(false);
        }
      }
    }).extend(User);
    adminUser = AdminUser.new("soplana", 1234);
    guestUser = GuestUser.new();
  });

  it('adminUser.name should be override', function(){
    assert.equal("soplana", adminUser.getName());
  });

  it('guestUser.name should not be override', function(){
    assert.equal("guest user", guestUser.getName());
  });
});
