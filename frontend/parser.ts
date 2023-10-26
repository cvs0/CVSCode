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
        const prev = this.tokens.shift() as Token;

        if(!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type)
            Deno.exit(1);
        }

        return prev;
    }

    public produceAST(sourceCode: string): Program {

        this.tokens = tokenize(sourceCode);
        
        const program: Program = {
            kind: "Program",
            body: [],
        };

        // parse until end of file
        while(this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt (): Stmt {
        // skip to parse_expr
        switch (this.at().type) {
            case TokenType.Let:
                return this.parse_var_declaration();
                
            case TokenType.Const:
                return this.parse_var_declaration();
            
            case TokenType.Fn:
                return this.parse_fn_declaration();

            case TokenType.If:
                return this.parse_if_statement();

            case TokenType.OpenBrace:
                return this.parse_block();
            
            default:
                return this.parse_expr();
        }
    }
    
    parse_block(): Stmt {
      this.expect(TokenType.OpenBrace, "Expected opening brace for block.");
      const body = new Array<Stmt>();

      while(this.at().type != TokenType.CloseBrace && this.not_eof()) {
        body.push(this.parse_stmt());
      }

      this.expect(TokenType.CloseBrace, "Expected closing brace for block.");

      return {
        kind: "BlockStmt",
        body,
      } as BlockStmt;
    }

    parse_if_statement(): Stmt {
        this.eat();
        this.expect(TokenType.OpenParen, "Expected opening parenthesis after if statement.");

        const condition = this.parse_expr();
        let alternate: Stmt | undefined;
        this.expect(TokenType.CloseParen, "Expected closing parenthesis after if statement.");

        const consequence = this.parse_stmt();

        if(this.at().type == TokenType.Else) {
            this.eat();
            alternate = this.parse_stmt();
        }
        
        return {
            kind: "IfStmt",
            condition,
            alternate,
            consequence,
        } as IfStmt;
    }

    parse_fn_declaration(): Stmt {
		this.eat(); // eat fn keyword
		const name = this.expect(
			TokenType.Identifier,
			"Expected function name following fn keyword"
		).value;

		const args = this.parse_args();
		const params: string[] = [];
		for (const arg of args) {
			if (arg.kind !== "Identifier") {
				console.log(arg);
				throw "Inside function declaration expected parameters to be of type string.";
			}

			params.push((arg as Identifier).symbol);
		}

		this.expect(
			TokenType.OpenBrace,
			"Expected function body following declaration"
		);
		const body: Stmt[] = [];

		while (
			this.at().type !== TokenType.EOF &&
			this.at().type !== TokenType.CloseBrace
		) {
			body.push(this.parse_stmt());
		}

		this.expect(
			TokenType.CloseBrace,
			"Closing brace expected inside function declaration"
		);

		const fn = {
			body,
			name,
			parameters: params,
			kind: "FunctionDeclaration",
		} as FunctionDeclaration;

		return fn;
	}

    // LET IDENT;
    // ( CONST / LET ) identifier = expr;
    parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier name following let | const keywords.",
        ).value;
        
        if(this.at().type == TokenType.Semicolon) {
            this.eat(); // expect semicolon
            if(isConstant) {
                throw "Must assign value to a constant expression. No value provided.";
            }

            return {
                kind: "VarDeclaration",
                identifier,
                constant: false,
            } as VarDeclaration;
        }

        this.expect(
            TokenType.Equals,
            "Expected 'equals token following identifier in var declaration."
        );

        const declaration = {
            kind: "VarDeclaration",
            value: this.parse_expr(),
            identifier,
            constant: isConstant,
        } as VarDeclaration;

        this.expect(
            TokenType.Semicolon,
            "Variable declaration statement must end with a semicolon."
        );

        return declaration;
    }

    private parse_expr (): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();

        if(this.at().type == TokenType.Equals) {
            this.eat();
            const value = this.parse_assignment_expr();

            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;
    }
    
    private parse_object_expr(): Expr {
      // { Prompts[] }
      if(this.at().type !== TokenType.OpenBrace) {
        return this.parse_comparison_expr();
      }

      this.eat(); // advance past open brace.

      const properties = new Array<Property>();

      while (this.not_eof() && this.at().type != TokenType.CloseBrace) {

        // { key: val, key2: val }

        const key = this.expect(TokenType.Identifier, "Object literal key expected.").value;


        // Allows shorthand key: pair -> { key, }
        if (this.at().type == TokenType.Comma) {
            this.eat(); // advance past comma
            properties.push({key, kind: "Property", value: undefined} as Property);
            continue;
        } // Allows shorthand key: pair -> { key }
        else if (this.at().type == TokenType.CloseBrace) {
            properties.push({key, kind: "Property", value: undefined});
            continue;
        }

        // { key }

        this.expect(
            TokenType.Colon,
            "Expected colon following key in object literal."
        );
        const value = this.parse_expr();

        properties.push({ kind: "Property", value, key });

        if (this.at().type != TokenType.CloseBrace) {
            this.expect(TokenType.Comma, "Expected comma following property in object literal.");
        }
      }

      this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");
      return { kind: "ObjectLiteral", properties } as ObjectLiteral;
    }

    private parse_additive_expr (): Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            
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
        let left = this.parse_additive_expr();
    
        if (this.at().value === "==") {
            while (this.at().value === "==") {
                const operator = this.eat().value;
                const right = this.parse_additive_expr();
    
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
    
    
    

    private parse_multiplicative_expr (): Expr {
        let left = this.parse_call_member_expr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();

            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_call_member_expr(): Expr {
      const member = this.parse_member_expr();

      if (this.at().type == TokenType.OpenParen) {
        return this.parse_call_expr(member);
      }

      return member;
    }

    private parse_call_expr(caller: Expr): Expr {
        let call_expr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args(),
        } as CallExpr;

        if ( this.at().type == TokenType.OpenParen) {
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open parenthesis.");

        const args = this.at().type == TokenType.CloseParen
            ? []
            : this.parse_arguements_list();

        this.expect(TokenType.CloseParen, "Missing closing parenthesis inside arguements list.");

        return args;
    }

    private parse_arguements_list(): Expr[] {
        const args = [this.parse_assignment_expr()];

        while (this.at().type == TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr());
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
            const operator = this.eat();

            let property: Expr;
            let computed: boolean;

            // non-computed values aka dot.expr
            if (operator.type == TokenType.Dot) {
                computed = false;
                
                // get identifier
                property = this.parse_primary_expr();

                if (property.kind != "Identifier") {
                    throw 'Cannot use dot operator without right hand side being an identifier.';
                }
            } else { // allows obj[computedValue]
                computed = true;
                property = this.parse_expr();

                this.expect(TokenType.CloseBracket, "Missing closing bracket in computed value.");
            }
            object = {
                kind: "MemberExpr",
                object,
                property,
                computed
            } as MemberExpr;
        }

        return object;
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