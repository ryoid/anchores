import { sha256 } from "@noble/hashes/sha256";
import { base58 } from "@scure/base";

/**
 * Global namespace for signatures, such as for instructions.
 *
 * @link https://github.com/coral-xyz/anchor/blob/2a07d841c65d6f303aa9c2b0c68a6e69c4739aab/lang/syn/src/codegen/program/common.rs#L11
 */
export const SIGHASH_GLOBAL_NAMESPACE = "global";

/**
 * Size of the discriminator in bytes.
 *
 * @link https://book.anchor-lang.com/anchor_bts/discriminator.html#discriminators-in-anchor-account-processing
 */
export const DISCRIMINATOR_SIZE = 8;

/**
 * Create a signature hash.
 *
 * @param namespace - The namespace of the event, e.g. `event`
 * @param name - The name of the event, e.g. `SwapEvent`
 * @returns The discriminator, encoded as base58 for convenience.
 *
 * @example
 * ```ts
 * const disc = createSighash("event", "SwapEvent")
 * ```
 */
export function createSighash(namespace: string, name: string): string {
  // https://github.com/coral-xyz/anchor/blob/2a07d841c65d6f303aa9c2b0c68a6e69c4739aab/lang/syn/src/codegen/program/common.rs#L13
  const signature = `${namespace}:${name}`;
  return base58.encode(sha256(signature).subarray(0, DISCRIMINATOR_SIZE));
}

/**
 * Decode signature hash of the data (first 8 bytes).
 *
 * @param eventData
 * @returns The discriminator, encoded as base58 for convenience.
 *
 * @example
 * ```ts
 * // When decoding instructions, remember to skip the instruction discriminator.
 * const ixData = base58.decode(ix.data).subarray(DISCRIMINATOR_SIZE);
 * const discriminator = decodeSighash(ixData);
 * ```
 */
export function decodeSighash(eventData: Uint8Array): string {
  return base58.encode(eventData.subarray(0, DISCRIMINATOR_SIZE));
}
