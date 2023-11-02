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

# Known-Issues

* The run file command only works inside VSCode integrated terminal:
    ```bash
    run <filename>.cvs
    ```
    
* Some issues with the strict operators inside if statements. (===, !==).

# Legal

## License

This project is licensed under the MIT License.

### MIT License

The MIT License is a permissive open-source license that allows you to freely use, modify, and distribute this project as long as you include the original copyright notice and disclaimers. 

For more details on the MIT License, please refer to the [LICENSE](LICENSE) file in this repository.

## Contributors

We welcome contributions from the community. By contributing to this project, you agree to release your contributions under the terms of the MIT License. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## Disclaimer

This project is provided as-is, and the authors and contributors are not liable for any issues or damages that may arise from its use. For more information, please read our [DISCLAIMER](DISCLAIMER.md) statement.

