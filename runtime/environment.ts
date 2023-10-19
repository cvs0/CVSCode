import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeVal, ValueTypes} from "./values.ts";

export function createGlobalEnv() {
    const env = new Environment();
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // define native built-in functions
    env.declareVar("print", MK_NATIVE_FN((args, scope) => {
        console.log(...args);
        return MK_NULL();
    }), true);

    function timeFunction (args: RuntimeVal[], env: Environment) {
        return MK_NUMBER(Date.now());
    }

    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

    function logFunction(args: RuntimeVal[], env: Environment) {
        const message = args.map(arg => arg.toString()).join(" ");
        console.log(message);
        return MK_NULL();
    }
    
    env.declareVar("log", MK_NATIVE_FN(logFunction), true);    
    
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