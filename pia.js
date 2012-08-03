pia = {};


//***********************************************
// InstanceConstruction constructor
//***********************************************
pia.InstanceConstruction = function(_class){
  this.klass      = _class;
  this.initialize = _class.initialize || function(){};
  this.public     = _class.public     || {};
  this.private    = _class.private    || {};
};


//***********************************************
// ClassConstruction constructor
//***********************************************
pia.ClassConstruction = function(_class){
  if(!!_class.self) this.private = _class.self.private || {};
  this.klass      = _class;
  this.public     = this.makePublicProperty(_class);
  this.initialize = function(klass){
    this.instanceConst = new pia.InstanceConstruction(klass);
  };
};


//***********************************************
// class construction
//***********************************************
pia.proto = {};
pia.proto.new = function(){
  var Klass = function(){};
  this.appendToProterty(Klass);
  var klassInstance = this.callInitialize(new Klass(), arguments);
  return this.createInstanceMethods(klassInstance);
};

pia.proto.createInstanceMethods = function(klassInstance){
  return this.convert(klassInstance);
};

pia.proto.callInitialize = function(klassInstance, args){
  if(!this.initialize) return klassInstance;
  this.initialize.apply(klassInstance, args[0]);
  return klassInstance;
};

pia.proto.convert = function(klassInstance){
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
  return new PiaObject();
};

pia.proto.appendToProterty = function(Klass){
  function to(klass, properties){
    for(var property in properties)
      klass.prototype[property] = properties[property];
    
    return klass
  };

  Klass = to(Klass, this.public);
  Klass = to(Klass, this.private);
  return Klass;
};


//***********************************************
// add InstanceConstruction methods
//***********************************************
pia.InstanceConstruction.prototype.new = pia.proto.new;
pia.InstanceConstruction.prototype.createInstanceMethods = pia.proto.createInstanceMethods;
pia.InstanceConstruction.prototype.callInitialize = pia.proto.callInitialize;
pia.InstanceConstruction.prototype.convert = pia.proto.convert;
pia.InstanceConstruction.prototype.appendToProterty = pia.proto.appendToProterty;


//***********************************************
// add ClassConstruction methods
//***********************************************
pia.ClassConstruction.prototype.new = function(){
  var Klass = function(){};
  this.appendToProterty(Klass);
  var klassInstance = this.callInitialize(new Klass(), this.klass);
  return this.createInstanceMethods(klassInstance);
};

pia.ClassConstruction.prototype.createInstanceMethods = pia.proto.createInstanceMethods;
pia.ClassConstruction.prototype.callInitialize = function(klassInstance, args){
  if(!this.initialize) return klassInstance;

  this.initialize.call(klassInstance, args);
  return klassInstance;
};

pia.ClassConstruction.prototype.convert = pia.proto.convert;
pia.ClassConstruction.prototype.appendToProterty = pia.proto.appendToProterty;

pia.ClassConstruction.prototype.makePublicProperty = function(_class){
  var public = {};
  if(!!_class.self){
    for(var key in _class.self.public){
      public[key] = _class.self.public[key];
    };
  };
  public["new"] = function(){
    for(var i=0, args=[]; i<arguments.length; i++) args[i]=arguments[i];
    return this.instanceConst.new(args);
  }
  return public;
};


//***********************************************
// pia.BaseObject Class 
//***********************************************
pia.BaseObject = function(_class){
  this.classConst    = new pia.ClassConstruction(_class);
  return this.classConst.new();
};

pia.BaseObject.prototype = {
  addClassMethods : function(){
    return this.classConst.new();
  }
};


//***********************************************
// pia.makeClass 
//***********************************************
pia.makeClass = function(_class){
  return new pia.BaseObject(_class);
};
