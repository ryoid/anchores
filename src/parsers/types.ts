export type Deserializer<T> = (data: Uint8Array) => T;

export interface Struct<
  T extends Record<string, any>,
  N extends string = string,
> {
  /**
   * Readable name of the struct.
   */
  name: N;
  /**
   * Base58 encoded discriminator.
   */
  discriminator: string;
  /**
   * Function to deserialize binary data into a struct.
   */
  parse: Deserializer<T>;
}
