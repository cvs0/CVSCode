import Environment from "../environment.ts";
import { RuntimeVal,MK_BOOL } from "../values.ts";

export function isIntFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "isInt function expects exactly one argument.";
    }

    const value = args[0].value;
    const result = Number.isInteger(value);
    return MK_BOOL(result);
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