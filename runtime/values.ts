import { Stmt } from "../frontend/ast.ts";
import Environment from "./environment.ts";

// deno-lint-ignore-file no-inferrable-types no-inferrable-types no-inferrable-types
export type ValueTypes = 
    | "null"
    | "number"
    | "boolean"
    | "object"
    | "native-fn"
    | "function"
    | "string";;

export interface RuntimeVal {
    type: ValueTypes;
    // deno-lint-ignore no-explicit-any
    value?: any;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}

export function MK_NULL () {
    return { type: "null", value: null} as NullVal;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}

export function MK_BOOL (b = true) {
    return { type: "boolean", value: b} as BooleanVal;
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

// deno-lint-ignore no-inferrable-types
export function MK_NUMBER (n: number = 0) {
    return { type: "number", value: n} as NumberVal;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export interface NativeFnValue extends RuntimeVal {
    type: "native-fn";
    call: FunctionCall;
}

export function MK_NATIVE_FN (call: FunctionCall) {
    return { type: "native-fn", call} as NativeFnValue;
}

export interface FunctionValue extends RuntimeVal {
    type: "function";
    name: string,
    parameters: string[],
    declarationEnv: Environment,
    body: Stmt[],
}

export function MK_STRING(value: string): RuntimeVal {
    return {
        type: "string", // Indicate that it's a string
        value: value,
    };
}
