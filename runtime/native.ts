import Environment from "./environment.ts";
import { MK_BOOL, MK_NULL, MK_NUMBER, MK_STRING, RuntimeVal } from "./values.ts";

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

export function sinhFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "sinh function expects exactly one argument.";
    }

    const value = args[0].value as number;

    const result = Math.sinh(value);
    return MK_NUMBER(result);
}

export function coshFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "cosh function expects exactly one argument.";
    }

    const value = args[0].value as number;

    const result = Math.cosh(value);
    return MK_NUMBER(result);
}

export function tanhFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "tanh function expects exactly one argument.";
    }

    const value = args[0].value as number;

    const result = Math.tanh(value);
    return MK_NUMBER(result);
}

export function expm1Function(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "expm1 function expects exactly one argument.";
    }

    const value = args[0].value as number;

    const result = Math.expm1(value);
    return MK_NUMBER(result);
}

export function log10Function(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "log10 function expects exactly one argument.";
    }

    const value = args[0].value as number;

    if (value <= 0) {
        throw "The argument must be greater than 0 for base-10 logarithm.";
    }

    const result = Math.log10(value);
    return MK_NUMBER(result);
}

export function sqrFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "sqr function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.pow(number, 2);
    return MK_NUMBER(result);
}

export function cubicFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "cubic function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.pow(number, 3);
    return MK_NUMBER(result);
}

export function pow10Function(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "pow10 function expects exactly one argument.";
    }

    const power = args[0].value as number;

    const result = Math.pow(10, power);
    return MK_NUMBER(result);
}

export function atan2Function(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "atan2 function expects exactly two arguments.";
    }

    const y = args[0].value as number;
    const x = args[1].value as number;

    const result = Math.atan2(y, x);
    return MK_NUMBER(result);
}

export function hypotFunction(args: RuntimeVal[], _env: Environment) {
    const numbers = args.map(arg => arg.value as number);

    const result = Math.hypot(...numbers);
    return MK_NUMBER(result);
}

export function truncFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "trunc function expects exactly one argument.";
    }

    const number = args[0].value as number;

    const result = Math.trunc(number);
    return MK_NUMBER(result);
}

export function signFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "sign function expects exactly one argument.";
    }

    const number = args[0].value as number;

    if (number > 0) return MK_NUMBER(1);
    if (number < 0) return MK_NUMBER(-1);
    return MK_NUMBER(0);
}

export function randIntFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "randInt function expects exactly two arguments.";
    }

    const min = args[0].value as number;
    const max = args[1].value as number;

    const result = Math.floor(Math.random() * (max - min + 1) + min);
    return MK_NUMBER(result);
}

export function degToRadFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "degToRad function expects exactly one argument.";
    }

    const degrees = args[0].value as number;
    const radians = (degrees * Math.PI) / 180;

    return MK_NUMBER(radians);
}

export function gcdFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length < 2) {
        throw "gcd function expects at least two arguments.";
    }

    const numbers = args.map(arg => {
        const value = arg.value as number;
        if (!Number.isInteger(value)) {
            throw "Arguments must be integers for gcd.";
        }
        return value;
    });

    const getGCD = (a: number, b: number): number => {
        if (b === 0) return a;
        return getGCD(b, a % b);
    };

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = getGCD(result, numbers[i]);
    }

    return MK_NUMBER(result);
}

export function printFunction(args: RuntimeVal[], _env: Environment) {
    console.log(...args);
    return MK_NULL();
}

export function printlnFunction(args: RuntimeVal[], _env: Environment) {
    console.log(...args);
    console.log(); // Print a newline after the arguments
    return MK_NULL();
}

export function factorialFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "factorial function expects exactly one argument.";
    }

    const n = args[0].value as number;

    if (!Number.isInteger(n) || n < 0) {
        throw "Argument must be a non-negative integer for factorial.";
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return MK_NUMBER(result);
}

export function isPrimeFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "isPrime function expects exactly one argument.";
    }

    const number = args[0].value as number;

    if (!Number.isInteger(number) || number <= 1) {
        throw "Argument must be a positive integer for prime check.";
    }

    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return MK_BOOL(false);
        }
    }

    return MK_BOOL(true);
}

export function fibonacciFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "fibonacci function expects exactly one argument.";
    }

    const n = args[0].value as number;

    if (!Number.isInteger(n) || n < 0) {
        throw "Argument must be a non-negative integer for Fibonacci.";
    }

    const fib = (n: number) => {
        if (n <= 1) return n;
        let a = 0;
        let b = 1;
        for (let i = 2; i <= n; i++) {
            const temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    };

    return MK_NUMBER(fib(n));
}

export function meanFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length < 1) {
        throw "mean function expects at least one argument.";
    }

    const numbers = args.map(arg => arg.value as number);

    const result = numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
    return MK_NUMBER(result);
}

export function medianFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length < 1) {
        throw "median function expects at least one argument.";
    }

    const numbers = args.map(arg => arg.value as number);

    numbers.sort((a, b) => a - b);

    if (numbers.length % 2 === 0) {
        const mid = numbers.length / 2;
        const median = (numbers[mid - 1] + numbers[mid]) / 2;
        return MK_NUMBER(median);
    } else {
        const mid = Math.floor(numbers.length / 2);
        return MK_NUMBER(numbers[mid]);
    }
}

export function isIntFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "isInt function expects exactly one argument.";
    }

    const value = args[0].value;
    const result = Number.isInteger(value);
    return MK_BOOL(result);
}

// STRING

export function strLenFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strLen function expects exactly one string argument.";
    }

    const str = args[0].value as string;
    return MK_NUMBER(str.length);
}

export function strIncludesFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strIncludes function expects exactly two string arguments.";
    }

    const str = args[0].value as string;
    const substring = args[1].value as string;

    if (str.includes(substring)) {
        return MK_BOOL(true);
    } else {
        return MK_BOOL(false);
    }
}

export function strEndsWithFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strEndsWith function expects exactly two string arguements.";
    }

    const str = args[0].value as string;
    const substring = args[1].value as string;
    
    if (str.endsWith(substring)) {
        return MK_BOOL(true);
    } else {
        return MK_BOOL(false);
    }
}

export function strStartsWithFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strStartsWith function expects exactly two string arguements.";
    }

    const str = args[0].value as string;
    const substring = args[1].value as string

    if (str.startsWith(substring)) {
        return MK_BOOL(true);
    } else {
        return MK_BOOL(false);
    }
}

export function strToUppercaseFunction (args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strToUppercase function expects exactly one string arguement.";
    }

    const str = args[0].value as string;

    return MK_STRING(str.toUpperCase());
}

export function strToLowerCaseFunction (args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strToLowerCase function expects exactly one string arguement."
    }

    const str = args[0].value as string;

    return MK_STRING(str.toLowerCase());
}

export function strReverseFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strReverse function expects exactly one string argument.";
    }

    const str = args[0].value as string;
    const reversedStr = str.split("").reverse().join("");

    return MK_STRING(reversedStr);
}

export function strTrimFunction (args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strTrim function expects exactly one string argument."
    }

    const str = args[0].value as string;
    
    return MK_STRING(str.trim());
}
