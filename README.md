# CVSCode

![](images/banner.png)

CVSCode is a simple scripting language that is built with TypeScript, made by CVS0. It uses Deno to launch the Repl, from that you can use the CVSCode command line interface to launch / debug your  CVSCode scripts.

# Features:
* Let / Const variables.
* Frequently updated.
* Fast language.
* Detailed error logs.
* Similar syntax to JavaScript / TypeScript.
* Custom user defined functions.
* Objects.
* Userdefined structures.
* Function calls.
* Object member expressions.
* If statements.
* Else statements.
* Comments.

# TODO:
* loops

# Credits:
* cvs0
* tlaceby

# How to use:
* How to launch the repl:
    Download CVSCode:
    ```bash
    git clone https://github.com/cvs0/cvscode.git
    ```

    CD into the directory:
    ```bash
    cd cvscode
    ```

    Launch the repl:
    ```bash
    deno run -A main.ts
    ```

    Run your script (while in the repl interface):
    ```bash
    run test.cvs
    ```

# Language-basics

* Basic output program:
    ```typescript
    let x = 25;

    if (x == 25) {
        print("X is 25.")
    }
    ```

* Operators:
    ```typescript
    let x = 25;
    let y = 20;

    if (x + y == 45) {
        print("Result was true.")
    }
    ```