import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, ObjectLiteral, WhileStmt } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL, NumberVal, BooleanVal, ObjectVal, NativeFnValue, FunctionValue } from "../values.ts";



export function eval_while_stmt(whileStmt: WhileStmt, env: Environment): RuntimeVal {
    const conditionValue = evaluate(whileStmt.condition, env);

    while (isTruthy(conditionValue)) {
        evaluate(whileStmt.body, env);
        conditionValue.value = isTruthy(evaluate(whileStmt.condition, env));
    }

    return MK_NULL();
}

export function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): BooleanVal | NumberVal {
    let result: number;

    switch (operator) {
        case "==":
            return createBooleanVal(lhs.value === rhs.value);
        case "!=":
            return createBooleanVal(lhs.value !== rhs.value);
        case "<":
            return createBooleanVal(lhs.value < rhs.value);
        case "<=":
            return createBooleanVal(lhs.value <= rhs.value);
        case ">":
            return createBooleanVal(lhs.value > rhs.value);
        case ">=":
            return createBooleanVal(lhs.value >= rhs.value);
        case "^":
            result = lhs.value ^ rhs.value;
            break;
        case "+":
            result = lhs.value + rhs.value;
            break;
        case "-":
            result = lhs.value - rhs.value;
            break;
        case "*":
            result = lhs.value * rhs.value;
            break;
        case "/":
            if (rhs.value === 0) {
                console.error("Division by zero");
                Deno.exit(1);
            }
            result = lhs.value / rhs.value;
            break;
        case "%":
            result = lhs.value % rhs.value;
            break;
        default:
            console.error("Unrecognized operator: " + operator);
            Deno.exit(1);
    }

    return createNumberVal(result);
}

export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (isNumber(lhs) && isNumber(rhs)) {
        return eval_numeric_binary_expr(lhs, rhs, binop.operator);
    }

    return MK_NULL();
}

export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
    return env.lookupVar(ident.symbol);
}

export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeVal {
    if (node.assigne.kind !== "Identifier") {
        throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assigne)}`;
    }

    const varname = (node.assigne as Identifier).symbol;

    return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(obj: ObjectLiteral, env: Environment): RuntimeVal {
    const object = { type: "object", properties: new Map() } as ObjectVal;

    for (const { key, value } of obj.properties) {
        const runtimeVal = value == undefined ? env.lookupVar(key) : evaluate(value, env);
        object.properties.set(key, runtimeVal);
    }

    return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
    const args = expr.args.map((arg) => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (isNativeFn(fn)) {
        return (fn as NativeFnValue).call(args, env);
    }

    if (isFunction(fn)) {
        const func = fn as FunctionValue;
        const scope = new Environment(func.declarationEnv);

        for (let i = 0; i < func.parameters.length; i++) {
            const varname = func.parameters[i];
            scope.declareVar(varname, args[i], false);
        }

        let result: RuntimeVal = MK_NULL();

        for (const stmt of func.body) {
            result = evaluate(stmt, scope);
        }

        return result;
    }

    throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}

// Helper functions

function isTruthy(val: RuntimeVal): boolean {
    return val.value !== null && val.value !== false;
}

function isNumber(val: RuntimeVal): val is NumberVal {
    return val.type === "number";
}

function isNativeFn(val: RuntimeVal): val is NativeFnValue {
    return val.type === "native-fn";
}

function isFunction(val: RuntimeVal): val is FunctionValue {
    return val.type === "function";
}

function createBooleanVal(value: boolean): BooleanVal {
    return {
        value,
        type: "boolean"
    };
}

function createNumberVal(value: number): NumberVal {
    return {
        value,
        type: "number"
    };
}
