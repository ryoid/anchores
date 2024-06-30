import fs from "node:fs/promises";
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import { parseTransaction } from "../src/index.js";
import {
  METEORA_DLMM_PROGRAM_ID,
  SwapEvent,
  SwapInstruction,
  type ParsedSwapEvent,
  type ParsedSwapInstruction,
} from "../src/parsers/meteora-dlmm.js";
import { getTransactionAndSave } from "./test-utils.js";

const FIXTURES_DIR = "./tests/fixtures/meteora-dlmm";

function getTestTransaction(txHash: string) {
  return getTransactionAndSave(txHash, FIXTURES_DIR);
}

beforeAll(async () => {
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
});

describe("parseTransaction", async () => {
  it("should parse swap instruction", async () => {
    const tx = await getTestTransaction(
      "EhfdfNdnWud1jXZt9A9FoDfqPmkDR8Di9xYvYdA3R5x6qdK6A7CvJte3TkQLnpj86o4ZsLsgQRZGifgZxyj41vn",
    );

    const structs = parseTransaction(
      METEORA_DLMM_PROGRAM_ID,
      {
        instructions: [SwapInstruction],
      },
      tx,
    );

    for (const struct of structs ?? []) {
      if (struct.type === "instruction") {
        expectTypeOf(struct.name).toEqualTypeOf(SwapInstruction.name);
        if (struct.name === SwapInstruction.name) {
          expectTypeOf(struct.data).toEqualTypeOf<ParsedSwapInstruction>();
        }
        continue;
      }
      expectTypeOf(struct.type).toBeNever();
    }

    expect(structs).toStrictEqual([
      {
        type: "instruction",
        name: "SwapInstruction",
        data: {
          amountIn: 44_765_283n,
          minAmountOut: 0n,
        },
      },
    ]);
  });

  it("should parse swap event", async () => {
    const tx = await getTestTransaction(
      "EhfdfNdnWud1jXZt9A9FoDfqPmkDR8Di9xYvYdA3R5x6qdK6A7CvJte3TkQLnpj86o4ZsLsgQRZGifgZxyj41vn",
    );

    const structs = parseTransaction(
      METEORA_DLMM_PROGRAM_ID,
      {
        events: [SwapEvent],
      },
      tx,
    );

    for (const struct of structs ?? []) {
      if (struct.type === "event") {
        expectTypeOf(struct.name).toEqualTypeOf(SwapEvent.name);
        continue;
      }
      expectTypeOf(struct.type).toBeNever();
    }

    expect(structs).toStrictEqual([
      {
        type: "event",
        name: "SwapEvent",
        data: {
          amountIn: 44_765_283n,
          amountOut: 933_267_444n,
          endBinId: 3039,
          fee: 9964n,
          feeBps: 222_563n,
          from: "9nnLbotNTcUhvbrsA6Mdkx45Sm82G35zo28AqUvjExn8",
          hostFee: 0n,
          lbPair: "EgSDeuHbP1AUF9Artd2qfquevKFdpkPTrnSFcPoXTf78",
          protocolFee: 0n,
          startBinId: 3039,
          swapForY: true,
        },
      },
    ]);
  });

  it("should parse swap instruction and event", async () => {
    const tx = await getTestTransaction(
      "EhfdfNdnWud1jXZt9A9FoDfqPmkDR8Di9xYvYdA3R5x6qdK6A7CvJte3TkQLnpj86o4ZsLsgQRZGifgZxyj41vn",
    );

    const structs = parseTransaction(
      METEORA_DLMM_PROGRAM_ID,
      {
        instructions: [SwapInstruction],
        events: [SwapEvent],
      },
      tx,
    );

    for (const struct of structs ?? []) {
      if (struct.type === "instruction") {
        expectTypeOf(struct.name).toEqualTypeOf(SwapInstruction.name);
        if (struct.name === SwapInstruction.name) {
          expectTypeOf(struct.data).toEqualTypeOf<ParsedSwapInstruction>();
        }
        continue;
      }
      expectTypeOf(struct.type).toEqualTypeOf("event" as const);
      if (struct.type === "event") {
        expectTypeOf(struct.name).toEqualTypeOf(SwapEvent.name);
        if (struct.name === SwapEvent.name) {
          expectTypeOf(struct.data).toEqualTypeOf<ParsedSwapEvent>();
        }
        continue;
      }
      expectTypeOf(struct).toBeNever();
    }

    expect(structs).toStrictEqual([
      {
        type: "instruction",
        name: "SwapInstruction",
        data: {
          amountIn: 44_765_283n,
          minAmountOut: 0n,
        },
      },
      {
        type: "event",
        name: "SwapEvent",
        data: {
          amountIn: 44_765_283n,
          amountOut: 933_267_444n,
          endBinId: 3039,
          fee: 9964n,
          feeBps: 222_563n,
          from: "9nnLbotNTcUhvbrsA6Mdkx45Sm82G35zo28AqUvjExn8",
          hostFee: 0n,
          lbPair: "EgSDeuHbP1AUF9Artd2qfquevKFdpkPTrnSFcPoXTf78",
          protocolFee: 0n,
          startBinId: 3039,
          swapForY: true,
        },
      },
    ]);
  });
});
