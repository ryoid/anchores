import { SIGHASH_GLOBAL_NAMESPACE, createSighash } from "../anchor.js";
import * as b from "../binary.js";

export const METEORA_DLMM_PROGRAM_ID =
  "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo";

export function parseSwapEvent(data: Uint8Array) {
  const reader = b.createReader(data);
  return {
    lbPair: b.publicKey(reader),
    from: b.publicKey(reader),
    startBinId: b.i32(reader),
    endBinId: b.i32(reader),
    amountIn: b.u64(reader),
    amountOut: b.u64(reader),
    swapForY: b.bool(reader),
    fee: b.u64(reader),
    protocolFee: b.u64(reader),
    feeBps: b.u128(reader),
    hostFee: b.u64(reader),
  };
}
export type ParsedSwapEvent = ReturnType<typeof parseSwapEvent>;

export const SwapEvent = {
  name: "SwapEvent" as const,
  discriminator: createSighash("event", "Swap"),
  parse: parseSwapEvent,
};

export function parseSwapInstruction(data: Uint8Array) {
  const reader = b.createReader(data);
  return {
    amountIn: b.u64(reader),
    minAmountOut: b.u64(reader),
  };
}
export type ParsedSwapInstruction = ReturnType<typeof parseSwapInstruction>;

export const SwapInstruction = {
  name: "SwapInstruction" as const,
  discriminator: createSighash(SIGHASH_GLOBAL_NAMESPACE, "swap"),
  parse: parseSwapInstruction,
};
