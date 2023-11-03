import Environment from "../environment.ts";
import { RuntimeVal,MK_NULL, MK_NUMBER } from "../values.ts";

export function printFunction(args: RuntimeVal[], _env: Environment) {
    console.log(...args);

    return MK_NULL();
}

export function printlnFunction(args: RuntimeVal[], _env: Environment) {
    console.log(...args);

    // Print a newline
    console.log();

    return MK_NULL();
}

export function timeFunction(_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Date.now());
}