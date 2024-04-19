// deno-lint-ignore-file no-inferrable-types no-unused-vars ban-ts-comment ban-unused-ignore

export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String,             // ""

    // Keywords
    Let,                // let
    Const,              // const
    Fn,                 // fn
    If,                 // if
    While,              // for
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
    let: TokenType.Let,            // let
    const: TokenType.Const,        // const
    fn: TokenType.Fn,              // fn
    if: TokenType.If,              // if
    else: TokenType.Else,          // else
    while: TokenType.While         // while
}

// define the token interface, which holds the value and type for the current token.
export interface Token {
    value: string,
    type: TokenType,
}

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

// Tokenize the source code and convert it all into tokens
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
        
        // parse the opening paren
        else if(src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }

        // parse the closing paren
        else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }

        // parse the opening brace
        else if (src[0] == "{") {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        }

        // parse the closing brace
        else if (src[0] == "}") {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        }

        // parse the opening square bracket
        else if (src[0] == "[") {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        }

        // parse the closing square bracket
        else if (src[0] == "]") {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        }

        // parse the XOR operand
        else if (src[0] == "^") {
            // parse the XOR equals operand
            if (src[1] == "=") {
                // push the XOR equal operand
                tokens.push(token(spliceFront(src, 2), TokenType.XorEqual));
            } else {
                // push the XOR operand as a BinaryOperator
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }

        // parse the plus operand
        else if (src[0] == "+") {
            // parse the increment operand
            if (src[1] == "+") {
                // push the incremet operand
                tokens.push(token(spliceFront(src, 2), TokenType.Increment));
            } else if(src[1] == '=') {
                // push the += operand
                tokens.push(token(spliceFront(src, 2), TokenType.PlusEquals));
            } else {
                // push the = as a BinaryOperator
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }

        // parse the minus operand
        else if (src[0] == "-") {
            // parse the decrement operand
            if (src[1] == "-") {
                // push the decrement operand
                tokens.push(token(spliceFront(src, 2), TokenType.Decrement));
            } if(src[1] == '=') {
                // push the -= operand
                tokens.push(token(spliceFront(src, 2), TokenType.MinusEquals));
            } else {
                // push the - as a BinaryOperator
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }
        
        // parse the multiplication operand
        else if (src[0] == "*") {
            // parse the *= operand
            if(src[1] == '=') {
                // push the *= operand
                tokens.push(token(spliceFront(src, 2), TokenType.TimesEquals));
            } else {
                // push the = as a BinaryOperator
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        }
        
        // parse the division operand
        else if (src[0] == "/") {
            // parse the /= operand
            if(src[1] == '=') {
                // push the /= operand
                tokens.push(token(spliceFront(src, 2), TokenType.DivideEquals));
            } else {
                // push the / as a BinaryOperator
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

        // parse the ; symbol
        else if (src[0] == ';') {
            // push the ; symbol
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
