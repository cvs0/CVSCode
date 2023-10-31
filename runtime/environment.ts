import {
    absFunction,
    acosFunction,
    asinFunction,
    atanFunction,
    ceilFunction,
    cosFunction,
    expFunction,
    floorFunction,
    logFunction,
    maxFunction,
    minFunction,
    powFunction,
    rndFunction,
    roundFunction,
    sinFunction,
    sqrtFunction,
    tanFunction,
    timeFunction
} from "./native.ts";

import {
    MK_BOOL,
    MK_NATIVE_FN,
    MK_NULL,
    MK_NUMBER,
    RuntimeVal
} from "./values.ts";

export function createGlobalEnv() {
    const env = new Environment();

    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // define native built-in functions
    env.declareVar("print", MK_NATIVE_FN((args, _scope) => {
        console.log(...args);
        return MK_NULL();
    }), true);
    env.declareVar("println", MK_NATIVE_FN((args, _scope) => {
        console.log(...args);
        return MK_NULL();
    }), true);
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
    env.declareVar("log", MK_NATIVE_FN(logFunction), true);
    env.declareVar("random", MK_NATIVE_FN(rndFunction), true);
    env.declareVar("sqrt", MK_NATIVE_FN(sqrtFunction), true);
    env.declareVar("pow", MK_NATIVE_FN(powFunction), true);
    env.declareVar("round", MK_NATIVE_FN(roundFunction), true);
    env.declareVar("abs", MK_NATIVE_FN(absFunction), true);
    env.declareVar("ceil", MK_NATIVE_FN(ceilFunction), true);
    env.declareVar("floor", MK_NATIVE_FN(floorFunction), true);
    env.declareVar("min", MK_NATIVE_FN(minFunction), true);
    env.declareVar("max", MK_NATIVE_FN(maxFunction), true);
    env.declareVar("exp", MK_NATIVE_FN(expFunction), true);
    env.declareVar("sin", MK_NATIVE_FN(sinFunction), true);
    env.declareVar("cos", MK_NATIVE_FN(cosFunction), true);
    env.declareVar("tan", MK_NATIVE_FN(tanFunction), true);
    env.declareVar("asin", MK_NATIVE_FN(asinFunction), true);
    env.declareVar("acos", MK_NATIVE_FN(acosFunction), true);
    env.declareVar("atan", MK_NATIVE_FN(atanFunction), true);
    
    return env;
}

export default class Environment {

    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor (parentENV?: Environment) {
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVar (
        varname: string,
        value: RuntimeVal,
        constant: boolean
    ): RuntimeVal {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname}. As it already is defined.`;
        }

        this.variables.set(varname, value);
        
        if(constant) {
            this.constants.add(varname);
        }

        return value;
    }

    public assignVar (varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
        
        if(env.constants.has(varname)) {
            throw `Cannot assign value to constant ${varname}.`;
        }

        env.variables.set(varname, value);

        return value;
    }

    public lookupVar (varname: string): RuntimeVal {
        const env = this.resolve(varname);

        return env.variables.get(varname) as RuntimeVal;
    }

    public resolve (varname: string): Environment {
        if (this.variables.has(varname)) {
            return this;
        }

        if(this.parent == undefined) {
            throw `Cannot resolve '${varname}' as it does not exist.`;
        }

        return this.parent.resolve(varname);
    }
}