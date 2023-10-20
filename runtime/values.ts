import Environment from "./environment.ts";

// deno-lint-ignore-file no-inferrable-types no-inferrable-types no-inferrable-types
export type ValueTypes = 
    | "null"
    | "number"
    | "boolean"
    | "object"
    | "native-fn";

export interface RuntimeVal {
    type: ValueTypes;
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

export function MK_NUMBER (n: number = 0) {
    return { type: "number", value: n} as NumberVal;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal | Promise<RuntimeVal>;

export interface NativeFnValue extends RuntimeVal {
    type: "native-fn";
    call: FunctionCall;
}

export function MK_NATIVE_FN (call: FunctionCall) {
    return { type: "native-fn", call} as NativeFnValue;
}