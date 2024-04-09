# CVSCode

![Banner](images/banner.png)

CVSCode is an elegant scripting language crafted with TypeScript, developed by CVS0. It leverages Deno to initiate the REPL (Read-Eval-Print Loop). Through this, you can employ the CVSCode command-line interface to effortlessly launch and debug your CVSCode scripts.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Language Basics](#language-basics)
- [Features](#features)
- [Todo](#todo)
- [Credits](#credits)
- [Known Issues](#known-issues)
- [Pull Request Requirements](#pull-request-requirements)
- [Legal](#legal)

## Installation

To get started with CVSCode, follow these steps:

1. Clone the CVSCode GitHub repository to your local machine:

    ```bash
    git clone https://github.com/cvs0/cvscode.git
    ```

2. Navigate to the CVSCode directory:

    ```bash
    cd cvscode
    ```

3. Start the REPL interface:

    ```bash
    deno run -A main.ts
    ```

4. Run your CVSCode script (while in the REPL interface):

    ```shell
    run <filename>.cvs
    ```

## Usage

CVSCode provides an easy-to-use scripting language for various applications. Here's a basic example:

```cvscode
let x = 25;

if (x == 25) {
    print("X is 25.")
}
```

For more examples and detailed instructions, please refer to the [Language-basics](#language-basics) section.

# Language Basics

CVSCode provides a versatile scripting language with a syntax that is familiar to JavaScript and TypeScript developers. This section covers some fundamental concepts and examples to help you get started with CVSCode.

## Basic Output Program

You can print messages to the console using the `print` function. Here's a simple program that checks a variable and prints a message:

```cvscode
let x = 25;

if (x == 25) {
    print("X is 25.")
}
```

In this example, we declare a variable `x` and use an `if` statement to check if it's equal to 25. If the condition is true, it prints "X is 25."

## Operators

CVSCode supports a range of operators for performing operations on variables. Here's an example of using operators to check the result of an addition:

```cvscode
let x = 25;
let y = 20;

if (x + y == 45) {
    print("Result was true.")
}
```

In this code, we declare two variables, `x` and `y`, and use the addition operator to calculate their sum. Then, we use an `if` statement to check if the result is equal to 45 and print a message accordingly.

These are just basic examples of CVSCode's functionality. You can explore more advanced features, data structures, and control flow as you delve deeper into your CVSCode scripts.

# Features

CVSCode offers a wide range of features, including:

- **Let / Const Variables**
- **Frequent Updates**
- **High Performance**
- **Detailed Error Logs**
- **JavaScript/TypeScript-Like Syntax**
- **Custom User-Defined Functions**
- **Objects**
- **While loops**
- **User-Defined Structures**
- **Function Calls**
- **Object Member Expressions**
- **Conditional Statements**
- **Comments**

These features collectively make CVSCode a versatile and powerful programming language for a wide range of applications.

## Todo

We are actively working on adding support libraries and more assignment expressions.

## Roadmap

- ~~While Loops~~
- For Loops

## Credits

This project is made possible by the contributions and efforts of the following individuals:

- **cvs0:** Lead developer and creator of CVSCode.
- **tlaceby:** Provided lots of assistance in the creation of CVSCode.

## Known Issues

Note: All of these issues are planned to be fixed. This section is for making them public knowledge for contributors and active users.

- The `run` file command only works inside the VSCode integrated terminal.
- Variable names cannot contain integers.
- Some operators do not work as of now.

## Pull Request Requirements

### TypeScript and Deno Specific Guidelines

To ensure consistency and maintain the quality of the CVSCode project, we have established the following requirements for pull requests specifically related to TypeScript and Deno:

1. **Code Conformance**
2. **Linting**
3. **Testing**
4. **Documentation**
5. **Dependencies**
6. **Commit Messages**
7. **Branching Strategy**
8. **Review and Discussion**

By following these TypeScript and Deno-specific guidelines, you will help us maintain the project's code quality and streamline the contribution process. Thank you for your contributions to the CVSCode project!

## Legal

### License

This project is licensed under the MIT License. For more details on the MIT License, please refer to the [LICENSE](LICENSE) file in this repository.

### Contributors

We welcome contributions from the community. By contributing to this project, you agree to release your contributions under the terms of the MIT License. See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute.

### Disclaimer

This project is provided as-is, and the authors and contributors are not liable for any issues or damages that may arise from its use. For more information, please read our [DISCLAIMER](docs/DISCLAIMER.md) statement.
