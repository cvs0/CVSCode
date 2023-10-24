import { BlockStmt, FunctionDeclaration, IfStmt, Program, Stmt, VarDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanVal, FunctionValue, MK_BOOL, MK_NULL, NumberVal, ObjectVal, RuntimeVal } from "../values.ts";

export function eval_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

export function eval_var_declaration(
    declaration: VarDeclaration, 
    env: Environment
): RuntimeVal {
    const value = declaration.value
        ? evaluate(declaration.value, env)
        : MK_NULL();
    
    return env.declareVar(
        declaration.identifier,
        value,
        declaration.constant
    );
}

export function eval_function_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): RuntimeVal {
	// Create new function scope
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}

export function eval_if_stmt(stmt: IfStmt, env: Environment): RuntimeVal {
    const condition = evaluate(stmt.condition, env);

    if (isPositive(condition)) {
        return evaluate(stmt.consequence, env);
    } else if (stmt.alternate) {
        return evaluate(stmt.alternate, env);
    } else {
        return MK_NULL();
    }
}

export function eval_block_stmt(stmt: BlockStmt, env: Environment): RuntimeVal {
    let lastVal: RuntimeVal = MK_NULL();

    for (const statement of stmt.body) {
        lastVal = evaluate(statement, env);
    }

    return lastVal;
}

function isPositive(value: RuntimeVal): boolean {
    if (value.type === "boolean") {
        return (value as BooleanVal).value;
    } else if (value.type === "null") {
        return false;
    } else if (value.type === "number") {
        return (value as NumberVal).value !== 0;
    } else if (value.type === "object") {
        return (value as ObjectVal).properties.size > 0;
    } else {
        return true;
    }
}


