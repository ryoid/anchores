import { describe, expect, it } from "vitest";
import * as b from "./binary.js";

describe("binary functions", () => {
  it("deserialize publicKey", () => {
    const data = new Uint8Array([
      6, 155, 136, 87, 254, 171, 129, 132, 251, 104, 127, 99, 70, 24, 192, 53,
      218, 196, 57, 220, 26, 235, 59, 85, 152, 160, 240, 0, 0, 0, 0, 1,
    ]);
    const reader = b.createReader(data);

    expect(b.publicKey(reader)).toBe(
      "So11111111111111111111111111111111111111112",
    );
    expect(reader.offset).toBe(32);
  });

  it("deserialize u32", () => {
    const nsmall = [103, 0, 0, 0];
    const nmax = [255, 255, 255, 255];
    const reader = b.createReader(new Uint8Array([...nsmall, ...nmax]));

    expect(b.u32(reader)).toBe(103);
    expect(reader.offset).toBe(4);

    expect(b.u32(reader)).toBe(4_294_967_295);
  });

  it("deserialize u64", () => {
    const nsmall = [103, 0, 0, 0, 0, 0, 0, 0];
    const nlarge = [0, 1, 2, 3, 4, 5, 6, 7];
    const nmax = [255, 255, 255, 255, 255, 255, 255, 255];
    const data = new Uint8Array([...nsmall, ...nlarge, ...nmax]);
    const reader = b.createReader(data);

    expect(b.u64(reader)).toBe(103n);
    expect(reader.offset).toBe(8);

    expect(b.u64(reader)).toBe(506_097_522_914_230_528n);

    expect(b.u64(reader)).toBe(18_446_744_073_709_551_615n);
  });

  it("deserialize u128", () => {
    const nsmall = [104, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const nlarge = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const nmax = [
      255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
      255,
    ];
    const data = new Uint8Array([...nsmall, ...nlarge, ...nmax]);
    const reader = b.createReader(data);

    expect(b.u128(reader)).toBe(104n);
    expect(reader.offset).toBe(16);

    expect(b.u128(reader)).toBe(
      20_011_376_718_272_490_338_853_433_276_725_592_320n,
    );
    expect(b.u128(reader)).toBe(
      340_282_366_920_938_463_463_374_607_431_768_211_455n,
    );
  });

  it("deserialize i32", () => {
    const data = new Uint8Array([255, 255, 255, 127]);
    const reader = b.createReader(data);

    expect(b.i32(reader)).toBe(2_147_483_647);
    expect(reader.offset).toBe(4);
  });

  it("deserialize bool", () => {
    const data = new Uint8Array([1, 0]);
    const reader = b.createReader(data);

    expect(b.bool(reader)).toBe(true);
    expect(reader.offset).toBe(1);

    expect(b.bool(reader)).toBe(false);
    expect(reader.offset).toBe(2);
  });

  it("deserialize string", () => {
    const ssimple = [4, 0, 0, 0, 65, 66, 67, 68];
    const sutf8 = [
      30, 0, 0, 0, 195, 179, 195, 177, 64, 226, 128, 161, 216, 143, 216, 171,
      32, 230, 188, 162, 224, 160, 182, 226, 173, 144, 240, 159, 148, 146, 244,
      128, 128, 128,
    ];
    const reader = b.createReader(new Uint8Array([...ssimple, ...sutf8]));

    expect(b.string(reader)).toBe("ABCD");
    expect(reader.offset).toBe(8);

    expect(b.string(reader)).toBe("óñ@‡؏ث 漢࠶⭐🔒􀀀");
    expect(reader.offset).toBe(42);
  });
});
