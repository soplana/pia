//***********************************************
// pia.js v0.0.2
//***********************************************
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
pia.ClassConstruction = function(_class, __super__){
  if(!!_class.self) this.private = _class.self.private || {};
  this.klass      = _class;
  this.public     = this.makePublicProperty(_class);
  this.initialize = function(klass){
    this.instanceConst           = new pia.InstanceConstruction(klass);
    this.instanceConst.__super__ = __super__;
    this.__klass__               = klass;
  };
  return this;
};


//***********************************************
// class construction
//***********************************************
pia.proto = {};
pia.proto.new = function(){
  var PiaBaseObject = function(){};
  this.appendToProterty(PiaBaseObject);
  var klassInstance  = this.callInitialize(new PiaBaseObject(), arguments);
  klassInstance.__super__ = pia.proto.createSuperObject(this.__super__);
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
    var __super__ = this.__super__;

    for(var __publicProperty__ in __publicProperties__){
      if(typeof this[__publicProperty__] != 'function') continue;
      var funcString = '__proto__.'+__publicProperty__+' = function(){var func='+
                        this[__publicProperty__].toString()+';return func.apply(__self__, arguments)}';
      if(!!__super__){
        funcString = '(function(){ '+'function $super(){'+
        'return __super__["'+__publicProperty__+'"].apply(__self__, arguments)};'+funcString+' })();';
      };
      eval(funcString);
    }; 
  };

  classEval.call(klassInstance, PiaObject.prototype);
  return new PiaObject();
};

pia.proto.appendToProterty = function(PiaBaseObject){
  function to(klass, properties){
    for(var property in properties)
      klass.prototype[property] = properties[property];
    return klass
  };

  PiaBaseObject = to(PiaBaseObject, this.public);
  PiaBaseObject = to(PiaBaseObject, this.private);
  return PiaBaseObject;
};

pia.proto.createSuperObject = function(__super__){
  var PiaSuperObject = function(){};
  PiaSuperObject = pia.proto.appendToProterty.call(__super__, PiaSuperObject);
  return new PiaSuperObject();
};

pia.proto.extendProperties = function(superClass, childClass){
  var klass     = {};
  klass.public  = pia.proto.merge(superClass.public, childClass.public);
  klass.private = pia.proto.merge(superClass.private, childClass.private);
  
  var superSelf = superClass.self;
  var childSelf = childClass.self;
  if(!!superSelf || !!childSelf){
    klass.self         = {};
    klass.self.public  = pia.proto.merge(
      !!superSelf ? superSelf.public : {}, 
      !!childSelf ? childSelf.public : {}
    );
    klass.self.private = pia.proto.merge(
      !!superSelf ? superSelf.private : {}, 
      !!childSelf ? childSelf.private : {}
    );
  };
  
  klass.initialize = childClass.initialize || superClass.initialize;
  return klass;
};

pia.proto.merge = function merge(mainObj, subObj){
  var obj = {};
  for(var mainKey in mainObj)
    if(mainObj.hasOwnProperty(mainKey)) obj[mainKey] = mainObj[mainKey];
  for(var subKey in subObj)
    if(subObj.hasOwnProperty(subKey)) obj[subKey] = subObj[subKey];
  return obj;
};


//***********************************************
// add InstanceConstruction methods
//***********************************************
pia.InstanceConstruction.prototype.new                    = pia.proto.new;
pia.InstanceConstruction.prototype.createInstanceMethods  = pia.proto.createInstanceMethods;
pia.InstanceConstruction.prototype.callInitialize         = pia.proto.callInitialize;
pia.InstanceConstruction.prototype.convert                = pia.proto.convert;
pia.InstanceConstruction.prototype.appendToProterty       = pia.proto.appendToProterty;


//***********************************************
// add ClassConstruction methods
//***********************************************
pia.ClassConstruction.prototype.new = function(){
  var PiaBaseObject = function(){};
  this.appendToProterty(PiaBaseObject);
  var klassInstance       = this.callInitialize(new PiaBaseObject(), this.klass);
  klassInstance           = this.createInstanceMethods(klassInstance);
  klassInstance.__klass__ = this.klass;
  return klassInstance;
};

pia.ClassConstruction.prototype.createInstanceMethods = pia.proto.createInstanceMethods;
pia.ClassConstruction.prototype.callInitialize        = function(klassInstance, args){
  if(!this.initialize) return klassInstance;

  this.initialize.call(klassInstance, args);
  return klassInstance;
};

pia.ClassConstruction.prototype.convert            = pia.proto.convert;
pia.ClassConstruction.prototype.appendToProterty   = pia.proto.appendToProterty;
pia.ClassConstruction.prototype.makePublicProperty = function(_class, __super__){
  var public = {};

  if(!!_class.self)
    for(var key in _class.self.public) public[key] = _class.self.public[key];

  public["new"]    = this.createNewMethod; 
  public["extend"] = this.createExtendMethod;
  return public;
};

pia.ClassConstruction.prototype.createNewMethod = function(){
  for(var i=0, args=[]; i<arguments.length; i++) args[i]=arguments[i];
  return this.instanceConst.new(args);
};

pia.ClassConstruction.prototype.createExtendMethod = function(SuperClass){
  var klass = pia.proto.extendProperties(SuperClass.__klass__, this.__klass__)
  return new pia.ClassConstruction(klass, SuperClass.__klass__).new();
};


//***********************************************
// pia.BaseObject Class 
//***********************************************
pia.BaseObject = function(_class){
  this.classConst = new pia.ClassConstruction(_class);
  return this.classConst.new();
};


//***********************************************
// pia.makeClass 
//***********************************************
pia.makeClass = function(_class){
  return new pia.BaseObject(_class);
};
$class = pia.makeClass;
