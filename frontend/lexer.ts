import { KEYWORDS, Token, TokenType } from "./tokens.ts";
import { isAlpha, isInt, isSkippable, pushToken, token } from "./utils.ts";

// deno-lint-ignore-file no-inferrable-types no-unused-vars ban-ts-comment ban-unused-ignore


// Tokenize the source code and convert it all into tokens
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
    let line = 1;

    // Helper function to push a token
    function pushTokenWithType(src: string[], type: TokenType, tokens: Token[], shift: boolean = false) {
        pushToken(src, type, tokens, shift);
    }

    // Helper function to push a token with a value
    function pushTokenWithValue(src: string[], type: TokenType, value: string, tokens: Token[], shift: boolean = false) {
        tokens.push(token(value, type));
        if (shift) {
            src.shift();
        }
    }

    // Helper function to parse a multi-character operator
    function parseOperator(src: string[], operator: string, type: TokenType, tokens: Token[], shift: boolean = false) {
        if (src[1] === "=") {
            pushTokenWithValue(src, type, operator + "=", tokens, true);
        } else {
            pushTokenWithType(src, type, tokens);
        }
    }

    // Build each token until end of the file
    while (src.length > 0) {
        if (src[0] === "/" && src[1] === "/") {
            // @ts-ignore
            while (src.length > 0 && src[0] !== "\n") {
                src.shift();
            }

            // @ts-ignore
            if (src[0] === "\n") {
                src.shift();
                line++;
            }
        } else if (src[0] === "/" && src[1] === "*") {
            // Ignore multi-line comments
            src.shift();
            src.shift();

            // @ts-ignore
            while (src.length > 0 && (src[0] !== "*" || src[1] !== "/")) {
                src.shift();

                // @ts-ignore
                if (src[0] === '\n') {
                    line++;
                }
            }

            // @ts-ignore
            if (src[0] === "*" && src[1] === "/") {
                src.shift();
                src.shift();
            } else {
                throw new Error("Unterminated multi-line comment");
            }
        } else if (src[0] === "(") {
            pushTokenWithType(src, TokenType.OpenParen, tokens);
        } else if (src[0] === ")") {
            pushTokenWithType(src, TokenType.CloseParen, tokens);
        } else if (src[0] === "{") {
            pushTokenWithType(src, TokenType.OpenBrace, tokens);
        } else if (src[0] === "}") {
            pushTokenWithType(src, TokenType.CloseBrace, tokens);
        } else if (src[0] === "[") {
            pushTokenWithType(src, TokenType.OpenBracket, tokens);
        } else if (src[0] === "]") {
            pushTokenWithType(src, TokenType.CloseBracket, tokens);
        } else if (src[0] === "^") {
            parseOperator(src, "^", TokenType.XorEqual, tokens, true);
        } else if (src[0] === "+") {
            if (src[1] === "+") {
                parseOperator(src, "++", TokenType.Increment, tokens, true);
            } else if (src[1] === "=") {
                parseOperator(src, "+", TokenType.PlusEquals, tokens, true);
            } else {
                pushTokenWithType(src, TokenType.BinaryOperator, tokens);
            }
        } else if (src[0] === "-") {
            if (src[1] === "-") {
                parseOperator(src, "--", TokenType.Decrement, tokens, true);
            } else if (src[1] === "=") {
                parseOperator(src, "-", TokenType.MinusEquals, tokens, true);
            } else {
                pushTokenWithType(src, TokenType.BinaryOperator, tokens);
            }
        } else if (src[0] === "*") {
            if (src[1] === "=") {
                parseOperator(src, "*", TokenType.TimesEquals, tokens, true);
            } else {
                pushTokenWithType(src, TokenType.BinaryOperator, tokens);
            }
        } else if (src[0] === "/") {
            if (src[1] === "=") {
                parseOperator(src, "/", TokenType.DivideEquals, tokens, true);
            } else {
                pushTokenWithType(src, TokenType.BinaryOperator, tokens);
            }
        } else if (src[0] === "%") {
            pushTokenWithType(src, TokenType.BinaryOperator, tokens);
        } else if (src[0] === "=") {
            if (src[1] === "=") {
                pushTokenWithValue(src, TokenType.DoubleEquals, "==", tokens, true);
            } else {
                pushTokenWithType(src, TokenType.Equals, tokens);
            }
        } else if (src[0] === "!") {
            if (src[1] === "=") {
                pushTokenWithValue(src, TokenType.NotEquals, "!=", tokens, true);
            } else {
                pushTokenWithType(src, TokenType.Not, tokens);
            }
        } else if (src[0] === ">") {
            if (src[1] === "=") {
                pushTokenWithValue(src, TokenType.GreaterThanEquals, ">=", tokens, true);
            } else {
                pushTokenWithType(src, TokenType.GreaterThan, tokens);
            }
        } else if (src[0] === "<") {
            if (src[1] === "=") {
                pushTokenWithValue(src, TokenType.LessThanEquals, "<=", tokens, true);
            } else {
                pushTokenWithType(src, TokenType.LessThan, tokens);
            }
        } else if (src[0] === "&") {
            if (src[1] === "&") {
                pushTokenWithValue(src, TokenType.And, "&&", tokens, true);
            }
        } else if (src[0] === "|") {
            if (src[1] === "|") {
                pushTokenWithValue(src, TokenType.Or, "||", tokens, true);
            }
        } else if (src[0] === '"') {
            src.shift();
            let str = "";

            while (src.length > 0 && src[0] !== '"') {
                str += src.shift();
            }

            if (src[0] === '"') {
                src.shift();
                pushTokenWithType(src, TokenType.String, tokens);
            } else {
                throw new Error("Unterminated string literal");
            }
        } else if (src[0] === "'") {
            src.shift();
            let str = "";

            while (src.length > 0 && src[0] !== "'") {
                str += src.shift();
            }

            if (src[0] === "'") {
                src.shift();
                pushTokenWithType(src, TokenType.String, tokens);
            } else {
                throw new Error("Unterminated string literal");
            }
        } else if (src[0] === ";") {
            pushTokenWithType(src, TokenType.Semicolon, tokens);
        } else if (src[0] === ":") {
            pushTokenWithType(src, TokenType.Colon, tokens);
        } else if (src[0] === ",") {
            pushTokenWithType(src, TokenType.Comma, tokens);
        } else if (src[0] === ".") {
            pushTokenWithType(src, TokenType.Dot, tokens);
        } else {
            if (isInt(src[0])) {
                // Build number token
                let num = "";

                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            } else if (isAlpha(src[0])) {
                // Build identifier token
                let ident = "";

                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                const type = typeof reserved === "number" ? reserved : TokenType.Identifier;

                tokens.push(token(ident, type));
            } else if (isSkippable(src[0])) {
                src.shift(); // Skip current char
            } else {
                // Unrecognized character
                throw new Error(
                    "Unrecognized character found in source: " +
                    src[0].charCodeAt(0) +
                    src[0]
                );
            }
        }
    }

    // handle the EOF (end of file)
    tokens.push({
        type: TokenType.EOF,
        value: "EndOfFile"
    });

    // return our parsed tokens array
    return tokens;
}
