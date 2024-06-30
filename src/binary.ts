import { base58 } from "@scure/base";

export function publicKey(data: Uint8Array, offset: number): string {
  return base58.encode(data.subarray(offset, offset + 32));
}

export function u64(view: DataView, offset: number): bigint {
  return view.getBigUint64(offset, true);
}

export function u128(view: DataView, offset: number): bigint {
  return view.getBigUint64(offset, true) + view.getBigUint64(offset + 8, true);
}

export function i32(view: DataView, offset: number): number {
  return view.getInt32(offset, true);
}

export function bool(view: DataView, offset: number): boolean {
  return view.getUint8(offset) > 0;
}
