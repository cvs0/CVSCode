import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL, MK_NUMBER, NumberVal } from "./runtime/values.ts";
repl();

run("./test.txt");

async function run (filename: string) {
  const parser = new Parser();
  const env = new Environment();
  
  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);
  const result = evaluate(program, env);
  console.log(result);
}

function repl() {
  const parser = new Parser();
  const env = new Environment();
  console.log("\nRepl v0.2");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    // Produce AST From source-code
    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);
  }
}