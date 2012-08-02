var assert = require("assert")
require("../pia")

describe('pia.ObjectConstruction', function(){
  var user = null;
  before(function(){
    var User = pia.makeClass({
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
});