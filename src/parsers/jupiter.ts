import { createSighash } from "../anchor.js";
import * as b from "../binary.js";

export const JUPITER_V6_PROGRAM_ID =
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";

export function parseSwapEvent(data: Uint8Array) {
  const reader = b.createReader(data);
  return {
    amm: b.publicKey(reader),
    inputMint: b.publicKey(reader),
    inputAmount: b.u64(reader),
    outputMint: b.publicKey(reader),
    outputAmount: b.u64(reader),
  };
}
export type ParsedSwapEvent = ReturnType<typeof parseSwapEvent>;

export const SwapEvent = {
  name: "SwapEvent" as const,
  discriminator: createSighash("event", "SwapEvent"),
  parse: parseSwapEvent,
};

export function parseFeeEvent(data: Uint8Array) {
  const reader = b.createReader(data);
  return {
    account: b.publicKey(reader),
    mint: b.publicKey(reader),
    amount: b.u64(reader),
  };
}
export type ParsedFeeEvent = ReturnType<typeof parseFeeEvent>;

export const FeeEvent = {
  name: "FeeEvent" as const,
  discriminator: createSighash("event", "FeeEvent"),
  parse: parseFeeEvent,
};
