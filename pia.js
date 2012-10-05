//***********************************************
// pia.js v0.0.2
//***********************************************
(function(){



var pfunc = {};
pfunc.new = function(){
    var PiaBaseObject = function(){};
    this.appendToProterty(PiaBaseObject);
    var klassInstance  = (!!this.__super__ && !!this.__super__.initialize) ? 
        this.callInitialize(new PiaBaseObject(), arguments, this.__super__.initialize) :
        this.callInitialize(new PiaBaseObject(), arguments);

    klassInstance.__super__ = pfunc.createSuperObject(this.__super__);
    return this.createInstanceMethods(klassInstance);
};

pfunc.createInstanceMethods = function(klassInstance){
    return this.convert(klassInstance);
};

pfunc.callInitialize = function(klassInstance, args, superInitialize){
    if(!this.initialize) return klassInstance;

    if(!!superInitialize){
        var initialize = '(function(){'+
        'function $super(){return superInitialize.apply(klassInstance, arguments)};'+
        '('+this.initialize.toString()+').apply(klassInstance, args[0])'+
        '})()';
        eval(initialize);
    }else{
        this.initialize.apply(klassInstance, args[0]);
    };

    return klassInstance;
};

pfunc.convert = function(klassInstance){
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
                'return __super__["'+__publicProperty__+'"].apply(__self__, arguments)};'+
                funcString+' })();';
            };
            eval(funcString);
        }; 
    };

    classEval.call(klassInstance, PiaObject.prototype);
    return new PiaObject();
};

pfunc.appendToProterty = function(PiaBaseObject){
    function to(klass, properties){
        for(var property in properties)
            if(properties.hasOwnProperty(property))
                klass.prototype[property] = properties[property];
        return klass
    };

    PiaBaseObject = to(PiaBaseObject, this.public);
    PiaBaseObject = to(PiaBaseObject, this.private);
    return PiaBaseObject;
};

pfunc.createSuperObject = function(__super__){
    var PiaSuperObject = function(){};
    PiaSuperObject = pfunc.appendToProterty.call(__super__, PiaSuperObject);
    return new PiaSuperObject();
};

pfunc.extendProperties = function(superClass, childClass){
    var klass     = {};
    klass.public  = pfunc.merge(superClass.public, childClass.public);
    klass.private = pfunc.merge(superClass.private, childClass.private);

    var superSelf = superClass.self;
    var childSelf = childClass.self;
    if(!!superSelf || !!childSelf){
        klass.self         = {};
        klass.self.public  = pfunc.merge(
                !!superSelf ? superSelf.public : {}, 
                !!childSelf ? childSelf.public : {}
        );
        klass.self.private = pfunc.merge(
                !!superSelf ? superSelf.private : {}, 
                !!childSelf ? childSelf.private : {}
        );
    };

    klass.initialize = childClass.initialize || superClass.initialize;
    return klass;
};

pfunc.merge = function merge(mainObj, subObj){
    var obj = {};
    for(var mainKey in mainObj)
        if(mainObj.hasOwnProperty(mainKey)) obj[mainKey] = mainObj[mainKey];
    for(var subKey in subObj)
        if(subObj.hasOwnProperty(subKey)) obj[subKey] = subObj[subKey];
    return obj;
};




var pia = {};
//***********************************************
// InstanceConstruction constructor
//***********************************************
pia.InstanceConstruction = function(_class){
    this.klass      = _class;
    this.initialize = _class.initialize || function(){};
    this.public     = _class.public     || {};
    this.private    = _class.private    || {};
};

pia.InstanceConstruction.prototype.new                    = pfunc.new;
pia.InstanceConstruction.prototype.createInstanceMethods  = pfunc.createInstanceMethods;
pia.InstanceConstruction.prototype.callInitialize         = pfunc.callInitialize;
pia.InstanceConstruction.prototype.convert                = pfunc.convert;
pia.InstanceConstruction.prototype.appendToProterty       = pfunc.appendToProterty;




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

pia.ClassConstruction.prototype.new = function(){
    var PiaBaseObject = function(){};
    this.appendToProterty(PiaBaseObject);
    var klassInstance       = this.callInitialize(new PiaBaseObject(), this.klass);
    klassInstance           = this.createInstanceMethods(klassInstance);
    klassInstance.__klass__ = this.klass;
    return klassInstance;
};

pia.ClassConstruction.prototype.createInstanceMethods = pfunc.createInstanceMethods;
pia.ClassConstruction.prototype.callInitialize        = function(klassInstance, args){
    if(!this.initialize) return klassInstance;

    this.initialize.call(klassInstance, args);
    return klassInstance;
};

pia.ClassConstruction.prototype.convert            = pfunc.convert;
pia.ClassConstruction.prototype.appendToProterty   = pfunc.appendToProterty;
pia.ClassConstruction.prototype.makePublicProperty = function(_class, __super__){
    var public = {};

    if(!!_class.self)
        for(var key in _class.self.public) public[key] = _class.self.public[key];

    public.new    = this.createNewMethod; 
    public.extend = this.createExtendMethod;
    return public;
};

pia.ClassConstruction.prototype.createNewMethod = function(){
    for(var i=0, args=[]; i<arguments.length; i++) args[i]=arguments[i];
    return this.instanceConst.new(args);
};

pia.ClassConstruction.prototype.createExtendMethod = function(SuperClass){
    var klass = pfunc.extendProperties(SuperClass.__klass__, this.__klass__);
    return new pia.ClassConstruction(klass, SuperClass.__klass__).new();
};




//***********************************************
// $class
//***********************************************
var BaseObject = function(_class){
    this.classConst = new pia.ClassConstruction(_class);
    return this.classConst.new();
};




var g = null;
try{
    //g = global;
    g = window;
}catch(e){
    g = window;
};

g.$class = function(_class){
    return new BaseObject(_class);
};


})();
