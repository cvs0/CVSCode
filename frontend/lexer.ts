
export enum TokenType {
    // Literal Types
    Number,
    Identifier,

    // Keywords
    Let,
    Const,
    Fn, // fn

    // Grouping * Operators
    BinaryOperator,
    Equals,
    Comma,
    Dot,
    Colon,
    Semicolon,
    OpenParen, // (
    CloseParen, // )
    OpenBrace, // {
    CloseBrace, // }
    OpenBracket, // [
    CloseBracket, // ]
    EOF, // Signified the end of the file
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const: TokenType.Const,
    fn: TokenType.Fn,
}

export interface Token {
    value: string,
    type: TokenType,
}

function token (value = "", type: TokenType): Token {
    return { value, type};
}

function isAlpha (src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isSkippable (str: string) {
    return str == ' ' || str == '\n' || str == '\t' || str == '\r';
}

function isInt (str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("")

    // Build each token until end of the file
    while (src.length > 0) {
        if(src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (src[0] == "{") {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        } else if (src[0] == "}") {
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        } else if (src[0] == "[") {
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        } else if (src[0] == "]") {
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == '=') {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else if (src[0] == ';') {
            tokens.push(token(src.shift(), TokenType.Semicolon));
        } else if (src[0] == ':') {
            tokens.push(token(src.shift(), TokenType.Colon));
        } else if (src[0] == ',') {
            tokens.push(token(src.shift(), TokenType.Comma));
        } else if (src[0] == '.') {
            tokens.push(token(src.shift(), TokenType.Dot));
        } else {
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

                if(typeof reserved == "number") {
                    tokens.push(token(ident, reserved));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if (isSkippable(src[0])) {
                src.shift(); // skip current char
            } else {
                console.error(
					"Unreconized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				Deno.exit(1);
            }
        }
    }

    tokens.push({type: TokenType.EOF, value: "EndOfFile"});
    
    return tokens;
}