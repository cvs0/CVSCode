import Environment from "./environment.ts";
import { MK_NULL, MK_NUMBER, RuntimeVal } from "./values.ts";

export function sqrtFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "sqrt function expects exactly one argument.";
    }

    const number = args[0].value as number;
    
    if (isNaN(number)) {
        throw "Argument must be a valid number.";
    }

    if (number < 0) {
        throw "Square root of a negative number is not defined in real numbers.";
    }

    const result = Math.sqrt(number);
    return MK_NUMBER(result);
}

export function rndFunction(_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Math.random());
}

export function logFunction(args: RuntimeVal[], _env: Environment) {
    const message = args.map(arg => arg.toString()).join(" ");
    console.log(message);
    return MK_NULL();
}

export function timeFunction (_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Date.now());
}

export function powFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "pow function expects exactly two arguments.";
    }

    const base = args[0].value as number;
    const exponent = args[1].value as number;

    const result = Math.pow(base, exponent);
    return MK_NUMBER(result);
}

export function roundFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "round function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.round(number);
    return MK_NUMBER(result);
}

export function absFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "abs function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.abs(number);
    return MK_NUMBER(result);
}

export function ceilFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "ceil function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.ceil(number);
    return MK_NUMBER(result);
}

export function floorFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "floor function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.floor(number);
    return MK_NUMBER(result);
}

export function minFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length < 2) {
        throw "min function expects at least two arguments.";
    }

    const numbers = args.map(arg => arg.value as number);

    const result = Math.min(...numbers);
    return MK_NUMBER(result);
}

export function maxFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length < 2) {
        throw "max function expects at least two arguments.";
    }

    const numbers = args.map(arg => arg.value as number);

    const result = Math.max(...numbers);
    return MK_NUMBER(result);
}

export function expFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "exp function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.exp(number);
    return MK_NUMBER(result);
}

export function sinFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "sin function expects exactly one argument.";
    }

    const angle = args[0].value as number;

    const result = Math.sin(angle);
    return MK_NUMBER(result);
}

export function cosFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "cos function expects exactly one argument.";
    }

    const angle = args[0].value as number;

    const result = Math.cos(angle);
    return MK_NUMBER(result);
}

export function tanFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "tan function expects exactly one argument.";
    }

    const angle = args[0].value as number;

    const result = Math.tan(angle);
    return MK_NUMBER(result);
}

export function asinFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "asin function expects exactly one argument.";
    }

    const value = args[0].value as number;

    if (value < -1 || value > 1) {
        throw "Input value must be in the range [-1, 1] for arcsine.";
    }

    const result = Math.asin(value);
    return MK_NUMBER(result);
}

export function acosFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "acos function expects exactly one argument.";
    }

    const value = args[0].value as number;

    if (value < -1 || value > 1) {
        throw "Input value must be in the range [-1, 1] for arccosine.";
    }

    const result = Math.acos(value);
    return MK_NUMBER(result);
}

export function atanFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "atan function expects exactly one argument.";
    }

    const value = args[0].value as number;

    const result = Math.atan(value);
    return MK_NUMBER(result);
}
