
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

export const KEYWORDS: Record<string, TokenType> = {
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
