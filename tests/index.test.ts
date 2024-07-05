import { describe, it, expect } from "bun:test";
import { callVm } from "@seda-protocol/vm";
import { readFile } from "node:fs/promises";

const WASM_PATH = "build/debug.wasm";

describe("index.ts", () => {
  it("should be able to run", async () => {
    const wasmBinary = await readFile(WASM_PATH);
    const vmResult = await callVm({
      // Arguments passed to the VM
      args: [],
      // Environment variables passed to the VM
      envs: {},
      // The WASM binary in bytes
      binary: new Uint8Array(wasmBinary),
    });

    expect(vmResult.exitCode).toBe(0);
    expect(vmResult.resultAsString).toBe("Tatooine");
  });
});
