import { base58 } from "@scure/base";
import type { ParsedTransactionMeta } from "@solana/web3.js";
import { DISCRIMINATOR_SIZE, decodeSighash } from "./anchor.js";
import type { Struct } from "./parsers/types.js";

export type DecodedStruct<U extends Struct<any>> =
  U extends Struct<infer D, infer N> ? { name: N; data: D } : never;

type Singular<T extends string, U = T extends `${infer R}s` ? R : `${T}`> = U;

/**
 *
 * @param programId
 * @param structs
 * @param tx
 * @returns
 * ```ts
 * const tx = await connection.getParsedTransaction(txHash);
 * if (!tx?.meta?.innerInstructions) {
 *   throw new Error("No transaction instructions");
 * }
 * const structs = parseTransaction(
 *   METEORA_DLMM_PROGRAM_ID,
 *   { instructions: [SwapInstruction], events: [SwapEvent] },
 *   tx
 * );
 * ```
 */
export function parseTransaction<
  S extends {
    instructions?: Struct<any>[];
    events?: Struct<any>[];
  },
  K extends keyof S,
>(
  programId: string,
  structs: S,
  tx: { meta: ParsedTransactionMeta },
):
  | (K extends string
      ? S[K] extends (infer I)[]
        ? I extends Struct<any>
          ? ({ type: Singular<K> } & DecodedStruct<I>)[]
          : never
        : never
      : never)
  | undefined {
  if (!tx.meta?.innerInstructions) {
    return undefined;
  }

  const parsed = [];
  for (const inner of tx.meta.innerInstructions) {
    for (const ix of inner.instructions) {
      if (ix.programId.toString() !== programId || !("data" in ix)) {
        continue;
      }

      const ixData = base58.decode(ix.data);

      if (structs.instructions) {
        const parsedIx = decodeStructs(structs.instructions, ixData);
        if (parsedIx) {
          parsed.push(Object.assign(parsedIx, { type: "instruction" }));
          continue;
        }
      }

      if (structs.events) {
        const parsedEv = decodeEvents(structs.events, ixData);
        if (parsedEv) {
          parsed.push(Object.assign(parsedEv, { type: "event" }));
        }
      }
    }
  }
  return parsed as any;
}

/**
 * Decode events from a transaction instruction data.
 * @param structs - The event structs to decode.
 * @param ixData - The instruction data.
 * @returns
 *
 * @example
 * ```ts
 * const parsed = decodeEvents([SwapEvent, FeeEvent], data)
 * if (parsed.name === "SwapEvent") {
 *   parsed.data
 * }
 * ```
 */
export function decodeEvents<S extends Struct<any>>(
  structs: S[],
  ixData: Uint8Array,
) {
  // Skip instruction discriminator
  const evData = ixData.subarray(DISCRIMINATOR_SIZE);
  return decodeStructs(structs, evData);
}

/**
 * Decode structs from data.
 * @param structs
 * @param data
 * @returns
 *
 * @example
 * ```ts
 * const parsed = decodeStructs([SwapInstruction], data)
 * if (parsed.name === "SwapInstruction") {
 *   parsed.data
 * }
 * ```
 */
export function decodeStructs<S extends Struct<any>>(
  structs: S[],
  data: Uint8Array,
): DecodedStruct<S> | undefined {
  // Determine the struct type
  const discMap = new Map(
    structs.map((struct) => [struct.discriminator, struct]),
  );
  const disc = decodeSighash(data);
  const struct = discMap.get(disc);
  if (!struct) {
    return;
  }
  // Skip the discriminator
  const evData = data.subarray(DISCRIMINATOR_SIZE);
  const parsed = struct.parse(evData);
  if (!parsed) {
    return;
  }
  return {
    name: struct.name,
    data: parsed,
  } as DecodedStruct<S>;
}
