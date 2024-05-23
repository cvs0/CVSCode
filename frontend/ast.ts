export type NodeType = 
    // STATEMENTS
    | "Program"
    | "VarDeclaration"
    | "FunctionDeclaration"
    | "IfStmt"
    | "WhileStmt"
    | "BlockStmt"

    // EXPRESSIONS
    | "AssignmentExpr"
    | "MemberExpr"
    | "CallExpr"
    | "BinaryExpr"

    // LITERALS
    | "Property"
    | "ObjectLiteral"
    | "NumericLiteral"
    | "Identifier"
    | "StringLiteral";

// define our statement base
export interface Stmt {
    kind: NodeType;
}

// define our program base, which consists of an array of statements
export interface Program extends Stmt {
    kind: "Program",
    body: Stmt[];
}

// define our variable declaration base, which consists of if its constant (cannot be changed), its identifier, and its optional value. If the value is not passed it becomes null.
export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration",
    constant: boolean,
    identifier: string,
    value?: Expr;
}

export interface IfStmt extends Stmt {
    condition: Expr;
    consequence: Stmt;
    alternate?: Stmt;
}

export interface WhileStmt extends Stmt {
    kind: "WhileStmt";
    condition: Expr;
    body: Stmt;
}

export interface BlockStmt extends Stmt {
    kind: "BlockStmt";
    body: Stmt[];
}

export interface FunctionDeclaration extends Stmt {
    kind: "FunctionDeclaration";
    parameters: string[];
    name: string;
    body: Stmt[];
}

export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr",
    assigne: Expr,
    value: Expr;
}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string;
}

export interface CallExpr extends Expr {
    kind: "CallExpr";
    args: Expr[];
    caller: Expr;
}

export interface MemberExpr extends Expr {
	kind: "MemberExpr";
	object: Expr;
	property: Expr;
	computed: boolean;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

export interface Property extends Expr {
    kind: "Property";
    key: string,
    value?: Expr,
}

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: Property[]
}

export interface StringLiteral extends Expr {
    kind: "StringLiteral";
    value: string;
}