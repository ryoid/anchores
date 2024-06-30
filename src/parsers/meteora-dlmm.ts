import { SIGHASH_GLOBAL_NAMESPACE, createSighash } from "../anchor.js";
import * as b from "../binary.js";

export const METEORA_DLMM_PROGRAM_ID =
  "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo";

export function parseSwapEvent(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    lbPair: b.publicKey(data, 0), // + 32
    from: b.publicKey(data, 32), // + 32
    startBinId: b.i32(view, 64), // + 4
    endBinId: b.i32(view, 68), // + 4
    amountIn: b.u64(view, 72), // + 8
    amountOut: b.u64(view, 80), // + 8
    swapForY: b.bool(view, 88), // + 1
    fee: b.u64(view, 89), // + 8
    protocolFee: b.u64(view, 97), // + 8
    feeBps: b.u128(view, 105), // + 16
    hostFee: b.u64(view, 121), // + 8
  };
}
export type ParsedSwapEvent = ReturnType<typeof parseSwapEvent>;

export const SwapEvent = {
  name: "SwapEvent" as const,
  discriminator: createSighash("event", "Swap"),
  parse: parseSwapEvent,
};

export function parseSwapInstruction(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    amountIn: b.u64(view, 0), // + 8
    minAmountOut: b.u64(view, 8), // + 8
  };
}
export type ParsedSwapInstruction = ReturnType<typeof parseSwapInstruction>;

export const SwapInstruction = {
  name: "SwapInstruction" as const,
  discriminator: createSighash(SIGHASH_GLOBAL_NAMESPACE, "swap"),
  parse: parseSwapInstruction,
};
