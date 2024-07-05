import { afterEach, describe, it, expect, mock } from "bun:test";
import { file } from "bun";
import { executeDrWasm, executeTallyWasm } from "@seda-protocol/dev-tools/src/index";

const WASM_PATH = "build/debug.wasm";

const fetchMock = mock();

afterEach(() => {
  fetchMock.mockRestore();
});

describe("data request execution", () => {
  it("should aggregate the results from the different APIs", async () => {
    fetchMock.mockImplementation((url) => {
      if (url.host === "api.binance.com") {
        return new Response(JSON.stringify({ price: "1" }));
      } else if (url.host === "api.kucoin.com") {
        return new Response(JSON.stringify({ data: { price: "2" } }));
      } else if (url.host === "www.okx.com") {
        return new Response(JSON.stringify({ data: [{last: "1.5"}] }));
      }

      return new Response('Unknown request');
    });

    const wasmBinary = await file(WASM_PATH).arrayBuffer();

    const vmResult = await executeDrWasm(
      Buffer.from(wasmBinary),
      Buffer.from("eth-usdc"),
      fetchMock
    );

    expect(vmResult.exitCode).toBe(0);
    expect(vmResult.resultAsString).toBe("1.5");
  });

  it('should tally all results in a single data point', async () => {
    const wasmBinary = await file(WASM_PATH).arrayBuffer();
    const vmResult = await executeTallyWasm(Buffer.from(wasmBinary), Buffer.from('tally-inputs'), [{
      exitCode: 0,
      gasUsed: 0,
      inConsensus: true,
      result: '245.23'
    }]);

    const priceRaw = Buffer.from(vmResult.result ?? []).toString('hex');
    const price = BigInt('0x' + priceRaw);
    
    expect(vmResult.exitCode).toBe(0);
    expect(price).toBe(245230000n);
  });
});
