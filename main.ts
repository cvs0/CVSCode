import Parser from "./frontend/parser.ts";
import { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  try {
    if (!filename.toLowerCase().endsWith(".cvs")) {
      console.error("Invalid file type. You must provide a CVSCode file (.cvs).");
      return;
    }

    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);

    const result = evaluate(program, env);
  } catch (error) {
    console.error(`Error reading or evaluating file: ${error.message}`);
  }
}

async function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();
  console.log("\nRepl v0.3");

  while (true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    if(input == "clear") {
      console.clear();
      console.log("\nRepl v0.3");

      continue;
    }

    if (input.includes("run")) {

      const fileNameMatch = input.match(/run\s+(\S+)/);
      if (fileNameMatch) {

        const fileName = fileNameMatch[1];

        await run(fileName);

        continue;
      } else {
        console.error("Invalid run command. Use 'run <filename>.cvs'.");

        continue;
      }
    }

    const program = parser.produceAST(input);

    const result = evaluate(program, env);

    console.log(result);
  }
}

await repl();