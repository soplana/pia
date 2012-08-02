pia = {};

pia.ObjectConstruction = function(_class){
  this.klass      = _class;
  this.initialize = _class.initialize || function(){};
  this.public     = _class.public     || {};
  this.private    = _class.private    || {};
};

pia.ObjectConstruction.prototype = {

  new : function(){
    var Klass = function(){};
    this.appendToProterty(Klass);
    var klassInstance = this.callInitialize(new Klass(), arguments);
    klassInstance     = this.convert(klassInstance);
    
    return klassInstance;
  },

  callInitialize : function(klassInstance, args){
    this.initialize.apply(klassInstance, args);
    return klassInstance;
  },

  convert : function(klassInstance){
    var __publicProperties__  = this.public;
    var __privateProperties__ = this.private;
    var PiaObject = function(){};

    function classEval(proto){
      var __self__  = this;
      var __proto__ = PiaObject.prototype;
      
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

    classEval.call(klassInstance)
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
    return Klass;
  }
}

pia.Object = function(_class){
  this.construction = new pia.ObjectConstruction(_class);
  return this.make();
};

pia.Object.prototype = {
  make : function(){
    return this.construction;
  }
};

pia.makeClass = function(_class){
  var klass = new pia.Object(_class);
  return klass;
}
