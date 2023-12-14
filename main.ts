import Parser from "./frontend/parser.ts";
import { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

const version = "v0.5";

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  try {
    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);

    return evaluate(program, env);
  } catch (error) {
    console.error(`Error reading or evaluating file: ${error}`);
  }
}

if (Deno.args.includes("--run")) {
  if (Deno.args.length < 2) {
    console.error("Usage: deno run -A main.ts --run <filename.cvs>");
    Deno.exit(1);
  }

  const filename = Deno.args[1];
  await run(filename);
} else {
  const repl = async () => {
    const parser = new Parser();
    const env = createGlobalEnv();
    console.log("\nRepl " + version);

    while (true) {
      const input = prompt("> ");

      if (!input || input.includes("exit")) {
        Deno.exit(1);
      } else if (input == "help") {
        console.log("Available Commands:");
        console.log("  - run <filename.cvs>: Execute a CVSCode script from a file.");
        console.log("  - version: Display the REPL version.");
        console.log("  - clear: Clear the screen and reset the REPL.");

        continue;
      } else if(input == "version") {
        console.log("CVSCode Repl " + version);
        console.log("Made by cvs0.");

        continue;
      } else if(input == "clear") {
        console.clear();
        console.log("\nRepl " + version);

        continue;
      } else if (input.startsWith("run")) {
        const fileNameMatch = input.match(/run\s+(\S+)/);
        if (fileNameMatch) {
          const fileName = fileNameMatch[1];

          console.log("Running file: " + fileName);

          const result = await run(fileName);
          console.log("Result:", result);

          console.log("Ran file: " + fileName);
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
  };

  await repl();
}
