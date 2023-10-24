import { RuntimeVal, NumberVal } from "./values.ts"
import { AssignmentExpr, BinaryExpr, BlockStmt, CallExpr, FunctionDeclaration, Identifier, IfStmt, NumericLiteral, ObjectLiteral, Program, Stmt, VarDeclaration } from "../frontend/ast.ts"
import Environment from "./environment.ts";
import { eval_identifier,eval_binary_expr, eval_assignment, eval_object_expr, eval_call_expr } from "./eval/expressions.ts";
import { eval_block_stmt, eval_function_declaration, eval_if_stmt, eval_program,eval_var_declaration } from "./eval/statements.ts";

export function evaluate (astNode: Stmt, env: Environment): RuntimeVal {

    switch(astNode.kind) {
        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number",
        } as NumberVal;
        
        case "Identifier":
            return eval_identifier(astNode as Identifier, env);
        
        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral, env);
        
        case "CallExpr":
            return eval_call_expr(astNode as CallExpr, env);

        case "AssignmentExpr":
            return eval_assignment(astNode as AssignmentExpr, env)

        case  "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);
        
        case "Program":
            return eval_program(astNode as Program, env);
        
        // handle statements
        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);
        
        case "FunctionDeclaration":
            return eval_function_declaration(astNode as FunctionDeclaration, env);
        
        case "IfStmt":
            return eval_if_stmt(astNode as IfStmt, env);

        case "BlockStmt":
            return eval_block_stmt(astNode as BlockStmt, env);
            
        default:
            console.error("This AST Node has not yet been setup for interpretation.", astNode);
            
            Deno.exit(0);
    }
}