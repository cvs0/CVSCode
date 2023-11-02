// deno-lint-ignore-file no-explicit-any
import {
    Stmt,
    Program,
    Expr, 
    BinaryExpr,
    NumericLiteral,
    Identifier,
    VarDeclaration,
    AssignmentExpr,
    Property,
    ObjectLiteral,
    CallExpr,
    MemberExpr,
    FunctionDeclaration,
    IfStmt,
    BlockStmt,
    StringLiteral,
} from "./ast.ts";


import {
    Token,
    tokenize,
    TokenType
} from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at () {
        return this.tokens[0] as Token;
    }

    private eat () {
        const prev = this.tokens.shift() as Token;
        
        return prev;
    }

    private expect (type: TokenType, err: any) {
        const prev = this.eat();

        if(!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type)
            Deno.exit(1);
        }

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        // Tokenize the source code to obtain a list of tokens
        this.tokens = tokenize(sourceCode);
    
        // Create the root of the abstract syntax tree (AST)
        const program: Program = {
            kind: "Program",
            body: [],
        };
    
        try {
            // Iterate through tokens and parse statements until the end of the file
            while (this.not_eof()) {
                // Attempt to parse a statement
                const statement = this.parse_stmt();
    
                if (statement) {
                    // If parsing was successful, add the statement to the program body
                    program.body.push(statement);
                } else {
                    // If parsing failed, throw an error
                    throw new Error("Failed to parse statement");
                }
            }
        } catch (error) {
            // Handle any errors that occurred during parsing
            console.error(`Error parsing source code: ${error.message}`);
            // Re-throw a custom error to propagate it further, if needed
            throw new Error("Parsing failed", error);
        }
    
        // Return the completed AST
        return program;
    }

    private parse_stmt(): Stmt {
        // Determine the type of statement to parse based on the current token
        
        // Parse a variable declaration for 'let' and 'const' keywords
        switch (this.at().type) {
            case TokenType.Let:
                return this.parse_var_declaration();
                
            case TokenType.Const:
                return this.parse_var_declaration();
        
            // Parse a function declaration for the 'fn' keyword
            case TokenType.Fn:
                return this.parse_fn_declaration();
    
            // Parse an 'if' statement
            case TokenType.If:
                return this.parse_if_statement();
    
            // Parse a block statement enclosed in curly braces
            case TokenType.OpenBrace:
                return this.parse_block();
            
            // Parse a string literal
            case TokenType.String:
                return {
                    kind: "StringLiteral",
                    value: this.eat().value,
                } as StringLiteral;
    
            // If none of the above, assume it's an expression
            default:
                return this.parse_expr();
        }
    }
    
    parse_block(): Stmt {
        // Expect an opening brace to start a block statement
        this.expect(TokenType.OpenBrace, "Expected opening brace for block.");
    
        // Initialize an array to store statements within the block
        const body = new Array<Stmt>();
    
        // Continue parsing statements until a closing brace is encountered or the end of the input
        while (this.at().type !== TokenType.CloseBrace && this.not_eof()) {
            // Parse each statement within the block
            body.push(this.parse_stmt());
        }
    
        // Expect a closing brace to end the block statement
        this.expect(TokenType.CloseBrace, "Expected closing brace for block.");
    
        // Return a Block Statement containing the parsed statements
        return {
            kind: "BlockStmt",
            body,
        } as BlockStmt;
    }

    parse_if_statement(): Stmt {
        // Consume the 'if' keyword
        this.eat();
        
        // Expect an opening parenthesis after the 'if' statement
        this.expect(TokenType.OpenParen, "Expected opening parenthesis after if statement.");
    
        // Parse the condition expression within the if statement
        const condition = this.parse_expr();
    
        // Initialize 'alternate' as undefined; it's optional
        let alternate: Stmt | undefined;
    
        // Expect a closing parenthesis after the condition expression
        this.expect(TokenType.CloseParen, "Expected closing parenthesis after if statement.");
    
        // Parse the consequence (true-branch) of the if statement
        const consequence = this.parse_stmt();
    
        // Check if there is an 'else' clause
        if (this.at().type === TokenType.Else) {
            // Consume the 'else' keyword
            this.eat();
            // Parse the alternate (false-branch) of the if statement
            alternate = this.parse_stmt();
        }
        
        // Return an If Statement node with condition, consequence, and alternate
        return {
            kind: "IfStmt",
            condition,
            alternate,
            consequence,
        } as IfStmt;
    }    

    parse_fn_declaration(): Stmt {
        // Consume the 'fn' keyword
        this.eat();
    
        // Expect and extract the function name
        const name = this.expect(
            TokenType.Identifier,
            "Expected function name following fn keyword"
        ).value;
    
        // Parse function arguments and store them in 'args'
        const args = this.parse_args();
        const params: string[] = [];
    
        // Extract argument names from 'args' and check if they are of type 'Identifier'
        for (const arg of args) {
            if (arg.kind !== "Identifier") {
                // Handle an error if an argument is not of type 'Identifier'
                console.log(arg);
                throw "Inside function declaration, expected parameters to be of type string.";
            }
    
            params.push((arg as Identifier).symbol);
        }
    
        // Expect an opening brace to start the function body
        this.expect(
            TokenType.OpenBrace,
            "Expected function body following declaration"
        );
    
        // Initialize an array to store statements within the function body
        const body: Stmt[] = [];
    
        // Continue parsing statements until the end of the file or a closing brace is encountered
        while (
            this.at().type !== TokenType.EOF &&
            this.at().type !== TokenType.CloseBrace
        ) {
            body.push(this.parse_stmt());
        }
    
        // Expect a closing brace to end the function declaration
        this.expect(
            TokenType.CloseBrace,
            "Closing brace expected inside function declaration"
        );
    
        // Create a Function Declaration node with the parsed information
        const fn = {
            body,
            name,
            parameters: params,
            kind: "FunctionDeclaration",
        } as FunctionDeclaration;
    
        return fn;
    }
    
    // Parse a variable declaration statement.
    parse_var_declaration(): Stmt {
        // Check if the declaration is for a constant variable (const) or a regular variable (let).
        const isConstant = this.eat().type === TokenType.Const;

        // Expect and extract the identifier name.
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier name following let | const keywords."
        ).value;

        // If the statement ends with a semicolon, it's a declaration without an assignment.
        if (this.at().type === TokenType.Semicolon) {
            this.eat(); // Expect and consume the semicolon.
            if (isConstant) {
                throw "Must assign a value to a constant expression. No value provided.";
            }

            // Return a Variable Declaration node with no assignment.
            return {
                kind: "VarDeclaration",
                identifier,
                constant: false,
            } as VarDeclaration;
        }

        // Expect an 'equals' token (=) to indicate an assignment.
        this.expect(
            TokenType.Equals,
            "Expected 'equals' token following the identifier in var declaration."
        );

        // Parse the assigned expression and create a Variable Declaration node.
        const declaration = {
            kind: "VarDeclaration",
            value: this.parse_expr(),
            identifier,
            constant: isConstant,
        } as VarDeclaration;

        // Expect a semicolon to terminate the variable declaration statement.
        this.expect(
            TokenType.Semicolon,
            "Variable declaration statement must end with a semicolon."
        );

        return declaration;
    }

    // Parse an expression, which starts with an assignment expression.
    private parse_expr(): Expr {
        // Delegates the parsing to the assignment expression parser.
        return this.parse_assignment_expr();
    }

    // Parse an assignment expression, which can include assignments like '='.
    private parse_assignment_expr(): Expr {
        // Parse the left side of the assignment expression, which is often an object expression.
        const left = this.parse_object_expr();

        // Check if there is an assignment operator '=' in the current position.
        if (this.at().type === TokenType.Equals) {
            this.eat(); // Consume the assignment operator.

            // Parse the right side of the assignment expression.
            const value = this.parse_assignment_expr();

            // Return an Assignment Expression node with the left and right sides of the assignment.
            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        // If no assignment operator is found, return the left side as-is.
        return left;
    }

    
    // Parse an object expression, representing object literals like { key: value, key2: value }
    private parse_object_expr(): Expr {
        // If the current token is not an opening brace, it's not an object literal; parse a comparison expression instead.
        if (this.at().type !== TokenType.OpenBrace) {
            return this.parse_comparison_expr();
        }

        // Consume the opening brace to start parsing the object literal.
        this.eat();

        // Initialize an array to store object properties.
        const properties = new Array<Property>();

        // Continue parsing properties while not reaching the end of the input or a closing brace.
        while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            // Expect an identifier as the key for each property in the object literal.
            const key = this.expect(TokenType.Identifier, "Object literal key expected.").value;

            // Handle shorthand key: pair -> { key, }
            if (this.at().type === TokenType.Comma) {
                this.eat(); // Advance past the comma.
                properties.push({ key, kind: "Property", value: undefined } as Property);
                continue;
            }
            // Handle shorthand key: pair -> { key }
            else if (this.at().type === TokenType.CloseBrace) {
                properties.push({ key, kind: "Property", value: undefined });
                continue;
            }

            // Expect a colon to separate the key and value in the object literal.
            this.expect(
                TokenType.Colon,
                "Expected colon following key in object literal."
            );
            
            // Parse the value associated with the key in the object literal.
            const value = this.parse_expr();

            // Create a Property node with the key and value.
            properties.push({ kind: "Property", value, key });

            // If there are more properties, expect a comma to separate them.
            if (this.at().type !== TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "Expected comma following property in object literal.");
            }
        }

        // Expect a closing brace to terminate the object literal.
        this.expect(TokenType.CloseBrace, "Object literal missing a closing brace.");

        // Return an Object Literal node with the parsed properties.
        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
    }

    private parse_additive_expr(): Expr {
        // Parse the left operand as a multiplicative expression
        let left = this.parse_multiplicative_expr();
    
        // While the current token is '+' or '-', continue parsing binary expressions
        while (this.at().value === "+" || this.at().value === "-") {
            // Get the operator
            const operator = this.eat().value;
            // Parse the right operand as a multiplicative expression
            const right = this.parse_multiplicative_expr();
    
            // Create a Binary Expression node
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
    
        return left;
    }
    
    private parse_comparison_expr(): Expr {
        // Parse the left operand as an additive expression
        let left = this.parse_additive_expr();
    
        // If the current token is '==', parse multiple comparison expressions
        if (this.at().value === "==") {
            while (this.at().value === "==") {
                // Get the operator
                const operator = this.eat().value;
                // Parse the right operand as an additive expression
                const right = this.parse_additive_expr();
    
                // Create a Binary Expression node
                left = {
                    kind: "BinaryExpr",
                    left,
                    right,
                    operator,
                } as BinaryExpr;
            }
        }
    
        return left;
    }

    // Parse a multiplicative expression involving operators: /, *, or %
    private parse_multiplicative_expr(): Expr {
        // Parse the left operand using the call member expression parser
        let left = this.parse_call_member_expr();

        // Continue parsing multiplicative expressions while encountering /, *, or %
        while (this.at().value === "/" || this.at().value === "*" || this.at().value === "%") {
            const operator = this.eat().value; // Consume the operator token
            const right = this.parse_call_member_expr(); // Parse the right operand

            // Create a Binary Expression node to represent the multiplicative operation
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        // Return the result of the multiplicative expression parsing
        return left;
    }

    // Parse a call or member expression
    private parse_call_member_expr(): Expr {
        // Parse the member expression
        const member = this.parse_member_expr();

        // Check if the current token indicates a function call
        if (this.at().type === TokenType.OpenParen) {
            return this.parse_call_expr(member); // Parse the call expression
        }

        // If not a function call, return the member expression as is
        return member;
    }

    // Parse a call expression with a caller and arguments
    private parse_call_expr(caller: Expr): Expr {
        // Create a Call Expression node with the provided caller and parsed arguments
        let call_expr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args(),
        } as CallExpr;

        // Check if there's another open parenthesis, indicating nested calls
        if (this.at().type === TokenType.OpenParen) {
            // Recursively parse the nested call expression
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    // Parse a list of arguments within open and closing parentheses
    private parse_args(): Expr[] {
        // Expect an open parenthesis to start the arguments list
        this.expect(TokenType.OpenParen, "Expected open parenthesis.");

        // Initialize an array to store parsed arguments; it can be empty
        const args = this.at().type === TokenType.CloseParen
            ? []
            : this.parse_arguments_list();

        // Expect a closing parenthesis to end the arguments list
        this.expect(TokenType.CloseParen, "Missing closing parenthesis inside arguments list.");

        return args;
    }

    // Parse a list of function call arguments separated by commas
    private parse_arguments_list(): Expr[] {
        // Initialize an array to store parsed arguments, starting with the first argument
        const args = [this.parse_assignment_expr()];

        // Continue parsing additional arguments while encountering commas
        while (this.at().type === TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr()); // Parse and add the next argument
        }

        return args; // Return the array of parsed arguments
    }

    // Parse a member expression, including properties accessed via dot or square bracket notation
    private parse_member_expr(): Expr {
        // Parse the initial object as a primary expression
        let object = this.parse_primary_expr();

        // Continue parsing member expressions while encountering dot or open bracket
        while (this.at().type === TokenType.Dot || this.at().type === TokenType.OpenBracket) {
            const operator = this.eat(); // Consume the dot or open bracket

            let property: Expr;
            let computed: boolean;

            if (operator.type === TokenType.Dot) { // Non-computed values (e.g., dot.expr)
                computed = false;
                // Parse and get the identifier as the property
                property = this.parse_primary_expr();

                // Ensure that the property is an identifier
                if (property.kind !== "Identifier") {
                    throw 'Cannot use dot operator without the right-hand side being an identifier.';
                }
            } else { // Allows object[computedValue] (square bracket notation)
                computed = true;
                property = this.parse_expr(); // Parse the computed property expression
                this.expect(TokenType.CloseBracket, "Missing closing bracket in computed value.");
            }

            // Create a Member Expression node representing the property access
            object = {
                kind: "MemberExpr",
                object,
                property,
                computed,
            } as MemberExpr;
        }

        return object; // Return the resulting member expression
    }

    // Orders of prescidence
    //
    // AssignmentExpr
    // MemberExpr
    // FunctionCall
    // LogicalExpr
    // ComparisonExpr
    // AdditiveExpr
    // MultiplicativeExpr
    // UnaryExpr
    // PrimaryExpr

    private parse_primary_expr (): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;

            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value)
                } as NumericLiteral;
            
            case TokenType.String:
                return {
                    kind: "StringLiteral",
                    value: this.eat().value,
                } as StringLiteral;

            case TokenType.OpenParen: {
                this.eat(); // eat the opening param

                const value = this.parse_expr();

                this.expect(TokenType.CloseParen, "Unexpected token found inside parenthesised experession. Expected closing parenthesis."); // closing param

                return value
            }

            default:
                console.error("Unexpected token found during parsing!", this.at());
                Deno.exit(1);
        }
    }
}