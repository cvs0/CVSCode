import { Token, TokenType } from "./tokens.ts";

// Parses the token and returns an object containing the value and the type
export function token(value: string = "", type: TokenType): Token {
    if (typeof value !== 'string' || !Object.values(TokenType).includes(type)) {
        throw new Error('Invalid arguments for token function');
    }
    return { value, type };
}

export function isAlpha(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isAlpha function');
    }
    const upperCaseChar = char.toUpperCase();
    return upperCaseChar !== char.toLowerCase();
}

// Checks for skippable tokens
export function isSkippable(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isSkippable function');
    }
    return char === ' ' || char === '\n' || char === '\t' || char === '\r';
}

// Checks for integers (1, 2, 3, ...)
export function isInt(char: string): boolean {
    if (typeof char !== 'string' || char.length !== 1) {
        throw new Error('Invalid argument for isInt function');
    }
    const charCode = char.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return charCode >= bounds[0] && charCode <= bounds[1];
}

export function pushToken(src: string[], type: TokenType, tokens: Token[], splicefrnt?: boolean): void {
    if (!splicefrnt) {
        tokens.push(token(src.shift(), type));
    } else {
        tokens.push(token(spliceFront(src, 2), type))
    }
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
