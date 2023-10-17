import { ValueTypes, RuntimeVal, NumberVal, NullVal } from "./values.ts"
import { BinaryExpr, NodeType, NumericLiteral, Program, Stmt } from "../frontend/ast.ts"

function eval_program(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null"} as NullVal;

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
    }

    return lastEvaluated;
}

function eval_numeric_binary_expr (lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let result: number;

    if(operator == "+") {
        result = lhs.value + rhs.value;
    } else if (operator == "-") {
        result = lhs.value - rhs.value;
    } else if (operator == "*") {
        result = lhs.value * rhs.value;
    } else if (operator == "/") {
        // TODO: division by zero checks
        result = lhs.value / rhs.value;
    } else {
        result = lhs.value % rhs.value;
    }

    return { value: result, type: "number" }
}

function eval_binary_expr (binop: BinaryExpr): RuntimeVal {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    return { type: "null", value: "null" } as NullVal;
}

export function evaluate (astNode: Stmt): RuntimeVal {

    switch(astNode.kind) {
        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number",
        } as NumberVal;

        case "NullLiteral":
            return {
                value: "null",
                type: "null"
            } as NullVal;
        
        case  "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr);
        
        case "Program":
            return eval_program(astNode as Program);

        default:
            console.error("This AST Node has not yet been setup for interpretation.", astNode);
            Deno.exit(0);
    }
}