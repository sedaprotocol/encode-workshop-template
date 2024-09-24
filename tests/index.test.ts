import { afterEach, describe, it, expect, mock } from "bun:test";
import { file } from "bun";
import { executeDrWasm, executeTallyWasm } from "@seda-protocol/dev-tools"

const WASM_PATH = "build/debug.wasm";

const fetchMock = mock();

afterEach(() => {
  fetchMock.mockRestore();
});

describe("data request execution", () => {
  it("Should return hello, world", async () => {
    const wasmBinary = await file(WASM_PATH).arrayBuffer();

    const vmResult = await executeDrWasm(
      Buffer.from(wasmBinary),
      Buffer.from(""),
      fetchMock
    );

    expect(vmResult.exitCode).toBe(0);

    const result = vmResult.resultAsString;
    expect(result).toEqual("Hello, world");
  });

  it('should also return hello, world from tally', async () => {
    const wasmBinary = await file(WASM_PATH).arrayBuffer();

    // Result from the execution test
    let buffer = Buffer.from([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100]);
    const vmResult = await executeTallyWasm(Buffer.from(wasmBinary), Buffer.from('tally-inputs'), [{
      exitCode: 0,
      gasUsed: 0,
      inConsensus: true,
      result: buffer,
    }]);

    expect(vmResult.exitCode).toBe(0);
    const result = vmResult.resultAsString;
    expect(result).toEqual("Hello, world");
  });
});
