export interface ParsedArgs {
  [key: string]: string;
}

export function parseActionArgs(actionArgs: string): ParsedArgs {
  return actionArgs.split(";").reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    acc[key.trim()] = value.trim();
    return acc;
  }, {} as ParsedArgs);
}
