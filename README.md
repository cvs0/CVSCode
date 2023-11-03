# CVSCode

![](images/banner.png)

CVSCode is an elegant scripting language crafted with TypeScript, developed by CVS0. It leverages Deno to initiate the REPL (Read-Eval-Print Loop). Through this, you can employ the CVSCode command-line interface to effortlessly launch and debug your CVSCode scripts.

# Features:

- **Let / Const Variables:** This project allows you to declare and use variables using the "let" and "const" keywords, similar to JavaScript and TypeScript, providing flexibility and scope control.

- **Frequent Updates:** We are committed to providing frequent updates to enhance and improve the project, ensuring it remains up to date with the latest developments.

- **High Performance:** This project is designed for speed, offering a fast and efficient programming experience.

- **Detailed Error Logs:** In case of errors, the project provides detailed error logs to assist developers in diagnosing and resolving issues quickly.

- **JavaScript/TypeScript-Like Syntax:** This language features a syntax that's familiar to JavaScript and TypeScript developers, making it easy to transition and work with.

- **Custom User-Defined Functions:** Create your own custom functions, allowing you to encapsulate and reuse code efficiently.

- **Objects:** Utilize objects to structure and organize your data, providing a convenient way to work with complex data.

- **User-Defined Structures:** Define custom data structures tailored to your specific needs for data organization.

- **Function Calls:** Implement function calls to execute code blocks and achieve various tasks within your projects.

- **Object Member Expressions:** Access and manipulate object properties and members using intuitive expressions.

- **Conditional Statements:** Use "if" statements to add logic and control flow to your code, enhancing decision-making capabilities.

- **Else Statements:** Complement "if" statements with "else" for handling alternative scenarios and further control flow.

- **Comments:** Add comments to your code for documentation and clarification, making it easier for both yourself and others to understand the codebase.

These features collectively make CVSCode a versatile and powerful programming language for a wide range of applications.

# TODO:

- **Loops:** We are actively working on adding support for loops.

# Credits:

This project is made possible by the contributions and efforts of the following individuals:

- **cvs0:** Lead developer and creator of CVSCode.
- **tlaceby:** Provided lots of assistance in the creation of CVSCode.

# How to use:
## How to Launch the REPL (Read-Eval-Print-Loop):
  * Clone the CVSCode github repository to your local machine with this command:

    ```bash
    git clone https://github.com/cvs0/cvscode.git
    ```

  * Navigate to the CVSCode directory that we just downloaded the project to:
    ```bash
    cd cvscode
    ```

  * Start the REPL interface;

    ```bash
    deno run -A main.ts
    ```

  * Run your CVSCode script (while in the REPL interface):
    ```shell
    run <filename>.cvs
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

# Known Issues

## Note: All of these issues are planned to be fixed. This section is for making them public knowledge for contributors and active users.

* The run file command only works inside VSCode integrated terminal:

    ```bash
    run <filename>.cvs
    ```
  
* Variable names cannot contain integers.

* Some operators do not work as of now.

## Pull Request Requirements

### TypeScript and Deno Specific Guidelines

To ensure consistency and maintain the quality of the CVSCode project, we have established the following requirements for pull requests specifically related to TypeScript and Deno:

1. **Code Conformance:**
   - All TypeScript code must adhere to the [official TypeScript style guide](https://www.typescriptlang.org/tsconfig#tsconfig-json).
   - Deno-specific TypeScript code should also follow Deno's coding guidelines, which can be found in their official documentation.

2. **Linting:**
   - Run `deno lint` to check for code quality issues, and ensure there are no linting errors or warnings before submitting your pull request.

3. **Testing:**
   - All new features and bug fixes must include appropriate test cases to cover the changes.
   - Run `deno test` to make sure all tests pass successfully.

4. **Documentation:**
   - If you are introducing new Deno-specific functionality or changes, please update the documentation to reflect these updates.

5. **Dependencies:**
   - Ensure that new dependencies that you add are clearly stated in your pull request, this includes name and version.

6. **Commit Messages:**
   - Use meaningful commit messages that succinctly describe the purpose of your changes. For example, "feat: add new Deno module" or "fix: resolve TypeScript compilation error."

7. **Branching Strategy:**
   - Create a feature branch from the latest `main` branch and give it a descriptive name related to your changes.
   - When your changes are ready, create a pull request against the `main` branch.

8. **Review and Discussion:**
   - Be prepared to engage in discussions and address feedback during the pull request review process.

By following these TypeScript and Deno-specific guidelines, you will help us maintain the project's code quality and streamline the contribution process. Thank you for your contributions to CVSCode!

# Legal

## License

This project is licensed under the MIT License.

### MIT License

The MIT License is a permissive open-source license that allows you to freely use, modify, and distribute this project as long as you include the original copyright notice and disclaimers. 

For more details on the MIT License, please refer to the [LICENSE](LICENSE) file in this repository.

## Contributors

We welcome contributions from the community. By contributing to this project, you agree to release your contributions under the terms of the MIT License. See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute.

## Disclaimer

This project is provided as-is, and the authors and contributors are not liable for any issues or damages that may arise from its use. For more information, please read our [DISCLAIMER](docs/DISCLAIMER.md) statement.

