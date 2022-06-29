import { A8Connect } from "./lib.container";

if (window) {
  (window as any).A8Connect = A8Connect;
}

export default A8Connect;
export type { A8Connect } from "./lib.container";
export * from "./types";
