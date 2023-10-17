import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";
repl();

function repl() {
  const parser = new Parser();
  console.log("\nRepl v0.1");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    // Produce AST From source-code
    const program = parser.produceAST(input);

    const result = evaluate(program);
    console.log(result);
  }
}