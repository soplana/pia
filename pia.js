pia = {};

pia.InstanceConstruction = function(_class){
  this.klass      = _class;
  this.initialize = _class.initialize || function(){};
  this.public     = _class.public     || {};
  this.private    = _class.private    || {};
};

pia.ClassConstruction = function(_class){
  if(!!_class.self){
    this.private    = _class.self.private || {};
    var public = {};
    for(var key in _class.self.public){
      public[key] = _class.self.public[key];
    };
    public["new"] = function(){
    }
    this.public = public;
  };
  this.klass      = _class;
  this.initialize = null;
  this.instanceConst = new pia.InstanceConstruction(_class);
};

pia.proto = {

  new : function(args){
    var Klass = function(){};
    this.appendToProterty(Klass);
    var klassInstance = this.callInitialize(new Klass(), arguments);
    
    return this.createInstanceMethods(klassInstance);
  },

  createInstanceMethods : function(klassInstance){
    return this.convert(klassInstance);
  },

  callInitialize : function(klassInstance, args){
    if(!this.initialize) return klassInstance;
    this.initialize.apply(klassInstance, args);
    return klassInstance;
  },

  convert : function(klassInstance){
    var __publicProperties__  = this.public;
    var __privateProperties__ = this.private;
    
    var PiaObject = function(){};

    function classEval(__proto__){
      var __self__  = this;
      
      for(var __privateProperty__ in __privateProperties__){
        if(typeof this[__publicProperty__] != 'function') continue;
        eval(
          'var '+__privateProperty__+' = '+
          this[__privateProperty__].toString()+';'
        );
      }; 

      for(var __publicProperty__ in __publicProperties__){
        if(typeof this[__publicProperty__] != 'function') continue;
        eval(
          '__proto__.'+__publicProperty__+' = function(){var func='+
          this[__publicProperty__].toString()+';return func.apply(__self__, arguments)};'
        );
      }; 
    };

    classEval.call(klassInstance, PiaObject.prototype)
    console.log(PiaObject.prototype);
    return new PiaObject();
  },

  appendToProterty : function(Klass){
    function to(klass, properties){
      for(var property in properties)
        klass.prototype[property] = properties[property];
      
      return klass
    };

    Klass = to(Klass, this.public);
    Klass = to(Klass, this.private);
    Klass.prototype.new = function(){
      for(var i=0, args=[]; i<arguments.length; i++) args[i]=arguments[i];
      return this.instanceConst.new(args);
    };
    return Klass;
  }
};

pia.InstanceConstruction.prototype = pia.proto;
pia.ClassConstruction.prototype    = pia.proto;
//pia.ClassConstruction.prototype.new = function(){
//  for(var i=0, args=[]; i<arguments.length; i++) args[i]=arguments[i];
//  return this.instanceConst.new(args);
//};

pia.BaseObject = function(_class){
  this.classConst    = new pia.ClassConstruction(_class);
  //return this.instanceConst;
  return this.classConst.new();
};

pia.BaseObject.prototype = {
  addClassMethods : function(){
    return this.classConst.new();
  }
};

pia.makeClass = function(_class){
  return new pia.BaseObject(_class);
};


//////////////////////////////////////////////////
if (!Object.keys) {  
  Object.keys = (function () {  
    var hasOwnProperty = Object.prototype.hasOwnProperty,  
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),  
        dontEnums = [  
          'toString',  
          'toLocaleString',  
          'valueOf',  
          'hasOwnProperty',  
          'isPrototypeOf',  
          'propertyIsEnumerable',  
          'constructor'  
        ],  
        dontEnumsLength = dontEnums.length  
  
    return function (obj) {  
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')  
  
      var result = []  
  
      for (var prop in obj) {  
        if (hasOwnProperty.call(obj, prop)) result.push(prop)  
      }  
  
      if (hasDontEnumBug) {  
        for (var i=0; i < dontEnumsLength; i++) {  
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])  
        }  
      }  
      return result  
    }  
  })()  
};
