import Environment from "../environment.ts";
import { RuntimeVal,MK_NUMBER,MK_BOOL,MK_STRING } from "../values.ts";

export function strLenFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strLen function expects exactly one string argument.";
    }

    const str = args[0].value as string;
    return MK_NUMBER(str.length);
}

export function strIncludesFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strIncludes function expects exactly two string arguments.";
    }

    const str = args[0].value as string;
    const substring = args[1].value as string;

    if (str.includes(substring)) {
        return MK_BOOL(true);
    } else {
        return MK_BOOL(false);
    }
}

export function strEndsWithFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strEndsWith function expects exactly two string arguements.";
    }

    const str = args[0].value as string;
    const substring = args[1].value as string;

    if (str.endsWith(substring)) {
        return MK_BOOL(true);
    } else {
        return MK_BOOL(false);
    }
}

export function strStartsWithFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strStartsWith function expects exactly two string arguements.";
    }

    const str = args[0].value as string;
    const substring = args[1].value as string

    if (str.startsWith(substring)) {
        return MK_BOOL(true);
    } else {
        return MK_BOOL(false);
    }
}

export function strToUppercaseFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strToUppercase function expects exactly one string arguement.";
    }

    const str = args[0].value as string;

    return MK_STRING(str.toUpperCase());
}

export function strToLowerCaseFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strToLowerCase function expects exactly one string arguement.";
    }

    const str = args[0].value as string;

    return MK_STRING(str.toLowerCase());
}

export function strReverseFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strReverse function expects exactly one string arguement.";
    }

    const str = args[0].value as string;
    const reversedStr = str.split("").reverse().join("");

    return MK_STRING(reversedStr);
}

export function strTrimFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strTrim function expects exactly one string arguement.";
    }

    const str = args[0].value as string;

    return MK_STRING(str.trim());
}

export function strCharAtFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strCharAt function expects exactly two string arguements.";
    }

    const str = args[0].value as string;
    const index = args[1].value as number;

    return MK_STRING(str.charAt(index));
}

export function strNormalizeFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strNormalize function expects exactly two string arguements.";
    }

    const str = args[0].value as string;
    const mode = args[1].value as string;

    if (mode === undefined) {
        return MK_STRING(str.normalize(mode));
    }

    if (mode !== "NFC" && mode !== "NFD" && mode !== "NFKC" && mode !== "NFKD") {
        throw "strNormalize mode must be one of the following: 'NFC', 'NFD', 'NFKC', 'NFKD'.";
    }

    return MK_STRING(str.normalize(mode));
}

export function strTrimStartFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strTrim function expects exactly one string arguement.";
    }

    const str = args[0].value as string;

    return MK_STRING(str.trimStart());
}

export function strTrimEndFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw "strTrim function expects exactly one string arguement.";
    }

    const str = args[0].value as string;

    return MK_STRING(str.trimEnd());
}

export function strReplaceFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 3) {
        throw "strReplace function expects exactly three strings arguments.";
    }

    const str = args[0].value as string;
    const toReplace = args[1].value as string;
    const replaceWith = args[2].value as string;

    return MK_STRING(str.replace(toReplace, replaceWith));
}

export function strReplaceAllFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 3) {
        throw "strReplaceAll function expects exactly two strings arguments.";
    }

    const str = args[0].value as string;
    const toReplace = args[1].value as string;
    const replaceWith = args[2].value as string;

    return MK_STRING(str.replaceAll(toReplace, replaceWith));
}

export function strRepeatFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 2) {
        throw "strRepeat function expects exactly two strings arguments.";
    }

    const str = args[0].value as string;
    const number = args[1].value as number;

    return MK_STRING(str.repeat(number));
}