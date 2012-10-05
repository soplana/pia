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
        User = $class({
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
    var $g = {};
    
    before(function(){
        var User = $class({
            initialize : function(){
                this.name = this.name || "guest user";
                this.pass = this.pass || "guest";
            },
            public : {
                signIn : function(prefix){
                    return (prefix || "welcome") + " " + this.name;
                },
                getName : function(prefix){
                    return this.name;
                },
                getPass : function(prefix){
                    return this.pass;
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
                  isAdmin : function(unko){
                      return this.message(true);
                  }
            }
        }).extend(User);

        var GuestUser = $class({
            public : {
                isAdmin : function(chinko){
                    return this.message(false);
                }
            }
        }).extend(User);

        var PiaJsUser = $class({
            initialize : function(){
                this.name = "piajs";
                $super();
            },

            public : {
                isAdmin : function(chinko){
                    return this.message(false);
                }
            }
        }).extend(User);

        $g = {};
        $g.adminUser = AdminUser.new("soplana", 1234);
        $g.guestUser = GuestUser.new();
        $g.piaJsUser = PiaJsUser.new();
    });

    it('adminUser.name should be override', function(){
        assert.equal("soplana", $g.adminUser.getName());
    });

    it('guestUser.name should not be override', function(){
        assert.equal("guest user", $g.guestUser.getName());
    });

    it('adminUser.signIn should be override', function(){
        assert.equal("hello soplana", $g.adminUser.signIn());
    });

    it('guestUser.signIn should not be override', function(){
        assert.equal("welcome guest user", $g.guestUser.signIn());
    });

    it('adminUser.isAdmin should be override', function(){
        assert.equal("admin user", $g.adminUser.isAdmin());
    });

    it('guestUser.isAdmin should not be override', function(){
        assert.equal("guest user", $g.guestUser.isAdmin());
    });

    it('user.initialize & piaJsUser.initialize', function(){
        assert.equal("piajs", $g.piaJsUser.getName());
        assert.equal("guest", $g.piaJsUser.getPass());
    });
});
