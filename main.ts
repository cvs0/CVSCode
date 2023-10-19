import Parser from "./frontend/parser.ts";
import { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  try {
    // Ensure that the file type ends with ".csv"
    if (!filename.toLowerCase().endsWith(".cvs")) {
      console.error("Invalid file type. You must provide a CVSCode file (.cvs).");
      return;
    }

    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);
  } catch (error) {
    console.error(`Error reading or evaluating file: ${error.message}`);
  }
}

async function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();
  console.log("\nRepl v0.3");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");

    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    if(input == "clear") {
      console.clear();
      console.log("\nRepl v0.3");

      continue;
    }

    // Check if the input contains the "run" keyword.
    if (input.includes("run")) {

      // Extract the filename from the input.
      const fileNameMatch = input.match(/run\s+(\S+)/);
      if (fileNameMatch) {

        const fileName = fileNameMatch[1];

        await run(fileName); // Use await here to wait for the run function to complete.

        continue; // Skip the evaluation and prompt for the next input.
      } else {
        console.error("Invalid run command. Use 'run <filename>.cvs'.");

        continue; // Prompt for the next input.
      }
    }

    // Produce AST From source code
    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);
  }
}

await repl();
