// deno-lint-ignore-file no-inferrable-types no-unused-vars ban-ts-comment ban-unused-ignore

export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String,

    // Keywords
    Let,                // let
    Const,              // const
    Fn,                 // fn
    If,                 // if
    While,
    Else,               // else

    // Grouping * Operators
    BinaryOperator,     // +, -, *, /, %, ^
    Equals,             // =
    DoubleEquals,       // ==
    NotEquals,          // !=
    Comma,              // ,
    Dot,                // .
    Colon,              // :
    Semicolon,          // ;
    OpenParen,          // (
    CloseParen,         // )
    OpenBrace,          // {
    CloseBrace,         // }
    OpenBracket,        // [
    CloseBracket,       // ]
    EOF,                // Signified the end of the file
    LessThan,           // <
    GreaterThan,        // >
    LessThanEquals,     // <=
    GreaterThanEquals,  // >=
    And,                // &&
    Or,                 // ||
    PlusEquals,         // +=
    MinusEquals,        // -=
    TimesEquals,        // *=
    DivideEquals,       // /=
    Increment,          // ++
    Decrement,          // --
    Not,                // !
    XorEqual,           // ^=
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const: TokenType.Const,
    fn: TokenType.Fn,
    if: TokenType.If,
    else: TokenType.Else,
    while: TokenType.While
}

export interface Token {
    value: string,
    type: TokenType,
}

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

function isSkippable(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isSkippable function');
    }
    return char === ' ' || char === '\n' || char === '\t' || char === '\r';
}

function isInt(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isInt function');
    }
    const charCode = char.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return charCode >= bounds[0] && charCode <= bounds[1];
}


export function tokenize (sourceCode: string): Token[] {
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
        
        else if(src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }

        else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }

        else if (src[0] == "{") {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        }

        else if (src[0] == "}") {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        }

        else if (src[0] == "[") {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        }

        else if (src[0] == "]") {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        }

        else if (src[0] == "^") {
            if (src[1] == "=") {
                tokens.push(token(spliceFront(src, 2), TokenType.XorEqual));
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }

        else if (src[0] == "+") {
            if (src[1] == "+") {
                tokens.push(token(spliceFront(src, 2), TokenType.Increment));
            } else if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.PlusEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }

        else if (src[0] == "-") {
            if (src[1] == "-") {
                tokens.push(token(spliceFront(src, 2), TokenType.Decrement));
            } if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.MinusEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }
        
        else if (src[0] == "*") {
            if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.TimesEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }
        
        else if (src[0] == "/") {
            if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.DivideEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }
        
        else if (src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        

        else if (src[0] == '=') {
            if (src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.DoubleEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.Equals));
            }
        }

        else if (src[0] == '!') {
            if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.NotEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.Not));
            }
        }

        else if (src[0] == '>') {
            if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.GreaterThanEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.GreaterThan));
            }
        }

        else if (src[0] == '<') {
            if(src[1] == '=') {
                tokens.push(token(spliceFront(src, 2), TokenType.LessThanEquals));
            } else {
                tokens.push(token(src.shift(), TokenType.LessThan));
            }
        }        

        else if (src[0] == '&') {
            if(src[1] == '&') {
                tokens.push(token(spliceFront(src, 2), TokenType.And));
            }
        }

        else if (src[0] == "|") {
            if(src[1] == "|") {
                tokens.push(token(spliceFront(src, 2), TokenType.Or));
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
                tokens.push(token(str, TokenType.String));
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
                tokens.push(token(str, TokenType.String));
            } else {
                console.error("Unterminated string literal");
                Deno.exit(1);
            }
        }

        else if (src[0] == ';') {
            tokens.push(token(src.shift(), TokenType.Semicolon));
        }

        else if (src[0] == ':') {
            tokens.push(token(src.shift(), TokenType.Colon));
        }

        else if (src[0] == ',') {
            tokens.push(token(src.shift(), TokenType.Comma));
        }

        else if (src[0] == '.') {
            tokens.push(token(src.shift(), TokenType.Dot));
        }
        
        else {
            // Handles multicharacter tokens

            // Build number token
            if(isInt(src[0])) {
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

    tokens.push({
        type: TokenType.EOF,
        value: "EndOfFile"
    });
    
    return tokens;
}

function spliceFront(src: string[], n: number): string {
    if (!Array.isArray(src) || typeof n !== 'number' || n < 0) {
        throw new Error('Invalid arguments for spliceFront function');
    }

    if (n > src.length) {
        throw new Error('Value of n exceeds the length of the source array');
    }

    return src.splice(0, n).join("");
}
