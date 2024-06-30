import { base58 } from "@scure/base";

export type Reader = {
  data: Uint8Array;
  view: DataView;
  offset: number;
};

export function createReader(data: Uint8Array): Reader {
  return {
    data,
    view: new DataView(data.buffer, data.byteOffset, data.byteLength),
    offset: 0,
  };
}

/**
 * Deserializer function.
 *
 * Consume bytes by moving the reader's offset.
 */
export type Deserializer<T> = (reader: Reader) => T;

export function publicKey(reader: Reader): string {
  const size = 32;
  const value = base58.encode(
    reader.data.subarray(reader.offset, reader.offset + size),
  );
  reader.offset += size;
  return value;
}

export function u32(reader: Reader): number {
  const value = reader.view.getUint32(reader.offset, true);
  reader.offset += 4;
  return value;
}

export function u64(reader: Reader): bigint {
  const value = reader.view.getBigUint64(reader.offset, true);
  reader.offset += 8;
  return value;
}

export function u128(reader: Reader): bigint {
  const size = 16;
  const chunk = reader.data.subarray(reader.offset, reader.offset + size);
  let value = 0n;
  for (let i = size - 1; i >= 0; i--) {
    value = value << 8n;
    value = value + BigInt(chunk[i]);
  }

  reader.offset += size;
  return value;
}

export function i32(reader: Reader): number {
  const value = reader.view.getInt32(reader.offset, true);
  reader.offset += 4;
  return value;
}

export function bool(reader: Reader): boolean {
  const value = reader.view.getUint8(reader.offset) > 0;
  reader.offset += 1;
  return value;
}

export function string(reader: Reader): string {
  const len = u32(reader);
  const value = new TextDecoder().decode(
    reader.data.subarray(reader.offset, reader.offset + len),
  );
  reader.offset += len;
  return value;
}
