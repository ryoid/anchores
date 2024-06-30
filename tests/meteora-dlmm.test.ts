import { base58 } from "@scure/base";
import fs from "node:fs/promises";
import { beforeAll, describe, expect, it } from "vitest";

import { decodeEvents, decodeStructs } from "../src/index.js";
import {
  METEORA_DLMM_PROGRAM_ID,
  SwapEvent,
  SwapInstruction,
} from "../src/parsers/meteora-dlmm.js";
import {
  getTransactionAndSave,
  isPartialProgramInstruction,
} from "./test-utils.js";

const FIXTURES_DIR = "./tests/fixtures/meteora-dlmm";

function getTestTransaction(txHash: string) {
  return getTransactionAndSave(txHash, FIXTURES_DIR);
}

const isMeteoraInstruction = isPartialProgramInstruction(
  METEORA_DLMM_PROGRAM_ID,
);

beforeAll(async () => {
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
});

describe("parse meteora-dlmm swap instruction and event", async () => {
  it("should parse swap", async () => {
    const tx = await getTestTransaction(
      "EhfdfNdnWud1jXZt9A9FoDfqPmkDR8Di9xYvYdA3R5x6qdK6A7CvJte3TkQLnpj86o4ZsLsgQRZGifgZxyj41vn",
    );

    const structs = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isMeteoraInstruction).map((ix) => {
        const ixData = base58.decode(ix.data);
        const instruct = decodeStructs([SwapInstruction], ixData);
        if (instruct) {
          return instruct;
        }

        const event = decodeEvents([SwapEvent], ixData);
        return event;
      }),
    );

    expect(structs).toStrictEqual([
      {
        name: "SwapInstruction",
        data: {
          amountIn: 44_765_283n,
          minAmountOut: 0n,
        },
      },
      {
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
