import { A8Connect } from "./connect.container";

if (window) {
  (window as any).A8Connect = A8Connect;
}

export default A8Connect;
export type { A8Connect } from "./connect.container";
export * from "./types";
