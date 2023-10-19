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

            case TokenType.Const:
                return this.parse_var_declaration();
            default:
                return this.parse_expr();
        }
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
        return this.parse_additive_expr();
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

    private parse_multiplicative_expr (): Expr {
        let left = this.parse_primary_expr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
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