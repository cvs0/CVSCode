// deno-lint-ignore-file no-inferrable-types no-unused-vars ban-ts-comment ban-unused-ignore

import { KEYWORDS, Token, TokenType } from "./tokens.ts";

// Parses the token and returns an object containing the value and the type
function token(value: string = "", type: TokenType): Token {
    if (typeof value !== 'string' || !Object.values(TokenType).includes(type)) {
        throw new Error('Invalid arguments for token function');
    }
    return { value, type };
}

function isAlpha(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isAlpha function');
    }
    const upperCaseChar = char.toUpperCase();
    return upperCaseChar !== char.toLowerCase();
}

// Checks for skippable tokens
function isSkippable(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isSkippable function');
    }
    return char === ' ' || char === '\n' || char === '\t' || char === '\r';
}

// Checks for integers (1, 2, 3, ...)
function isInt(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isInt function');
    }
    const charCode = char.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return charCode >= bounds[0] && charCode <= bounds[1];
}

function pushToken(src: string[], type: TokenType, tokens: Token[], splicefrnt?: boolean): void {
    if (!splicefrnt) {
        tokens.push(token(src.shift(), type));
    } else {
        tokens.push(token(spliceFront(src, 2), type))
    }
}

// Tokenize the source code and convert it all into tokens
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("")
    const lines = sourceCode.split("\n").length;
    let line = 1;

    // Build each token until end of the file
    while (src.length > 0) {

        if (src[0] === "/" && src[1] === "/") {
            // Ignore the errors for no overlaps.
            // @ts-ignore
            while (src.length > 0 && src[0] !== "\n") {
                src.shift();
            }

            // Ignore the errors for no overlaps.
            // @ts-ignore
            if (src[0] === "\n") {
                src.shift();
                line++;
            }
        }

        else if (src[0] === "/" && src[1] === "*") {
            src.shift();
            src.shift();

            // Ignore the errors for no overlaps.
            // @ts-ignore
            while (src.length > 0 && !(src[0] === "*" && src[1] === "/")) {
                src.shift();

                // Ignore the errors for no overlaps.
                // @ts-ignore
                if (src[0] === "\n") {
                    line++;
                }
            }

            // Ignore the errors for no overlaps.
            // @ts-ignore
            if (src[0] === "*" && src[1] === "/") {
                src.shift();
                src.shift();
            } else {
                console.error("Unterminated multi-line comment");
                Deno.exit(1);
            }
        }

        // parse the opening paren
        else if (src[0] == '(') {
            pushToken(src, TokenType.OpenParen, tokens)
        }

        // parse the closing paren
        else if (src[0] == ")") {
            pushToken(src, TokenType.CloseParen, tokens)
        }

        // parse the opening brace
        else if (src[0] == "{") {
            pushToken(src, TokenType.OpenBrace, tokens)
        }

        // parse the closing brace
        else if (src[0] == "}") {
            pushToken(src, TokenType.CloseBrace, tokens)
        }

        // parse the opening square bracket
        else if (src[0] == "[") {
            pushToken(src, TokenType.OpenBracket, tokens)
        }

        // parse the closing square bracket
        else if (src[0] == "]") {
            pushToken(src, TokenType.CloseBracket, tokens)
        }

        // parse the XOR operand
        else if (src[0] == "^") {
            // parse the XOR equals operand
            if (src[1] == "=") {
                // push the XOR equal operand
                pushToken(src, TokenType.XorEqual, tokens, true)
            } else {
                // push the XOR operand as a BinaryOperator
                pushToken(src, TokenType.BinaryOperator, tokens)
            }
        }

        // parse the plus operand
        else if (src[0] == "+") {
            // parse the increment operand
            if (src[1] == "+") {
                // push the increment operand
                pushToken(src, TokenType.Increment, tokens, true)
            } else if (src[1] == '=') {
                // push the += operand
                pushToken(src, TokenType.PlusEquals, tokens, true)
            } else {
                // push the = as a BinaryOperator
                pushToken(src, TokenType.BinaryOperator, tokens)
            }
        }

        // parse the minus operand
        else if (src[0] == "-") {
            // parse the decrement operand
            if (src[1] == "-") {
                // push the decrement operand
                pushToken(src, TokenType.Decrement, tokens, true)
            } if (src[1] == '=') {
                // push the -= operand
                pushToken(src, TokenType.MinusEquals, tokens, true)
            } else {
                // push the - as a BinaryOperator
                pushToken(src, TokenType.BinaryOperator, tokens)
            }
        }

        // parse the multiplication operand
        else if (src[0] == "*") {
            // parse the *= operand
            if (src[1] == '=') {
                // push the *= operand
                pushToken(src, TokenType.TimesEquals, tokens, true)
            } else {
                // push the = as a BinaryOperator
                pushToken(src, TokenType.BinaryOperator, tokens)
            }
        }

        // parse the division operand
        else if (src[0] == "/") {
            // parse the /= operand
            if (src[1] == '=') {
                // push the /= operand
                pushToken(src, TokenType.DivideEquals, tokens, true)
            } else {
                // push the / as a BinaryOperator
                pushToken(src, TokenType.BinaryOperator, tokens)
            }
        }

        else if (src[0] == "%") {
            pushToken(src, TokenType.BinaryOperator, tokens)
        }

        else if (src[0] == '=') {
            if (src[1] == '=') {
                pushToken(src, TokenType.DoubleEquals, tokens, true)
            } else {
                pushToken(src, TokenType.Equals, tokens)
            }
        }

        else if (src[0] == '!') {
            if (src[1] == '=') {
                pushToken(src, TokenType.NotEquals, tokens, true)
            } else {
                pushToken(src, TokenType.Not, tokens)
            }
        }

        else if (src[0] == '>') {
            if (src[1] == '=') {
                pushToken(src, TokenType.GreaterThanEquals, tokens, true)
            } else {
                pushToken(src, TokenType.GreaterThan, tokens)
            }
        }

        else if (src[0] == '<') {
            if (src[1] == '=') {
                pushToken(src, TokenType.LessThanEquals, tokens, true)
            } else {
                pushToken(src, TokenType.LessThan, tokens)
            }
        }

        else if (src[0] == '&') {
            if (src[1] == '&') {
                pushToken(src, TokenType.And, tokens, true)
            }
        }

        else if (src[0] == "|") {
            if (src[1] == "|") {
                pushToken(src, TokenType.Or, tokens, true)
            }
        }

        else if (src[0] == '"') {
            src.shift();
            let str = "";

            while (src.length > 0 && src[0] !== '"') {
                str += src.shift();
            }

            if (src[0] === '"') {
                src.shift();
                pushToken(src, TokenType.String, tokens)
            } else {
                console.error("Unterminated string literal");
                Deno.exit(1);
            }
        }

        else if (src[0] == "'") {
            src.shift();
            let str = "";

            while (src.length > 0 && src[0] !== "'") {
                str += src.shift();
            }

            if (src[0] === "'") {
                src.shift();
                pushToken(src, TokenType.String, tokens)
            } else {
                console.error("Unterminated string literal");
                Deno.exit(1);
            }
        }

        // parse the ; symbol
        else if (src[0] == ';') {
            // push the ; symbol
            pushToken(src, TokenType.Semicolon, tokens)
        }

        else if (src[0] == ':') {
            pushToken(src, TokenType.Colon, tokens)
        }

        else if (src[0] == ',') {
            pushToken(src, TokenType.Comma, tokens)
        }

        else if (src[0] == '.') {
            pushToken(src, TokenType.Dot, tokens)
        }

        else {
            // Build number token
            if (isInt(src[0])) {
                let num = "";

                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));

            } else if (isAlpha(src[0])) {
                let ident = "";

                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                // check for reserved keywords
                const reserved = KEYWORDS[ident];

                if (typeof reserved == "number") {
                    tokens.push(token(ident, reserved));
                }
                else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            }
            else if (isSkippable(src[0])) {
                src.shift(); // skip current char
            } else {
                console.error(
                    "Unreconized character found in source: ",
                    src[0].charCodeAt(0),
                    src[0],
                );

                Deno.exit(1);
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

// splice the front of a string / number
function spliceFront(src: string[], n: number): string {
    if (!Array.isArray(src) || typeof n !== 'number' || n < 0) {
        throw new Error('Invalid arguments for spliceFront function');
    }

    if (n > src.length) {
        throw new Error('Value of n exceeds the length of the source array');
    }

    return src.splice(0, n).join("");
}
