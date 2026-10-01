import { execFileSync } from "node:child_process";

const TEST_PORT = 3100;

export default function globalTeardown() {
  if (process.platform !== "win32") return;

  const output = execFileSync("netstat.exe", ["-ano", "-p", "tcp"], { encoding: "utf8" });
  const listener = output
    .split(/\r?\n/)
    .find((line) => line.includes(`127.0.0.1:${TEST_PORT}`) && line.includes("LISTENING"));

  if (!listener) return;

  const processId = Number(listener.trim().split(/\s+/).at(-1));
  if (!Number.isInteger(processId) || processId <= 0) {
    throw new Error(`Unable to identify the process listening on E2E port ${TEST_PORT}.`);
  }

  process.kill(processId);
}
