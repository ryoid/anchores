import { createSighash } from "../anchor.js";
import * as b from "../binary.js";

export const JUPITER_V6_PROGRAM_ID =
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";

export function parseSwapEvent(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    amm: b.publicKey(data, 0), // + 32
    inputMint: b.publicKey(data, 32), // + 32
    inputAmount: b.u64(view, 64), // + 8
    outputMint: b.publicKey(data, 72), // + 32
    outputAmount: b.u64(view, 104), // + 8
  };
}
export type ParsedSwapEvent = ReturnType<typeof parseSwapEvent>;

export const SwapEvent = {
  name: "SwapEvent" as const,
  discriminator: createSighash("event", "SwapEvent"),
  parse: parseSwapEvent,
};

export function parseFeeEvent(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    account: b.publicKey(data, 0), // + 32
    mint: b.publicKey(data, 32), // + 32
    amount: b.u64(view, 64), // + 8
  };
}
export type ParsedFeeEvent = ReturnType<typeof parseFeeEvent>;

export const FeeEvent = {
  name: "FeeEvent" as const,
  discriminator: createSighash("event", "FeeEvent"),
  parse: parseFeeEvent,
};
