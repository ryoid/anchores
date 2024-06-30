import { base58 } from "@scure/base";
import fs from "node:fs/promises";
import { beforeAll, describe, expect, it } from "vitest";

import type { PartiallyDecodedInstruction } from "@solana/web3.js";
import { decodeEvents } from "../src/index.js";
import {
  FeeEvent,
  JUPITER_V6_PROGRAM_ID,
  SwapEvent,
} from "../src/parsers/jupiter.js";
import {
  getTransactionAndSave,
  isPartialProgramInstruction,
} from "./test-utils.js";

const FIXTURES_DIR = "./tests/fixtures/jupiter";

function getTestTransaction(txHash: string) {
  return getTransactionAndSave(txHash, FIXTURES_DIR);
}

const isJupiterInstruction = isPartialProgramInstruction(JUPITER_V6_PROGRAM_ID);

function decodeJupiterEvents(ix: PartiallyDecodedInstruction) {
  const data = base58.decode(ix.data);
  return decodeEvents([SwapEvent, FeeEvent], data);
}

beforeAll(async () => {
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
});

describe("parse jupiter swap result", async () => {
  it("should parse Raydium swap", async () => {
    const tx = await getTestTransaction(
      "3Cn7LoFcosLQAaYxHVAsXCnzKLvFSmb5Zg6qLqLqG41Xj7YKTAXVhQ8FsXT3fg1GvqvqtQGMp4waMhCj3iWu3Hpy",
    );

    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        name: "SwapEvent",
        data: {
          amm: "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY",
          inputMint: "So11111111111111111111111111111111111111112",
          inputAmount: 1_000_000n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputAmount: 151_150n,
        },
      },
      {
        name: "SwapEvent",
        data: {
          amm: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          inputAmount: 151_150n,
          outputMint: "AVLhahDcDQ4m4vHM4ug63oh7xc8Jtk49Dm5hoe9Sazqr",
          outputAmount: 6_755_485n,
        },
      },
      {
        name: "SwapEvent",
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputMint: "AVLhahDcDQ4m4vHM4ug63oh7xc8Jtk49Dm5hoe9Sazqr",
          inputAmount: 6_755_485n,
          outputMint: "A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ",
          outputAmount: 405_391n,
        },
      },
    ]);
  });

  it("should parse Meteora DLMM swap", async () => {
    const tx = await getTestTransaction(
      "5hEWA54E6AGWTRBfqbx4RtpjAZif5C9yFhZKRDNeMhugd3oZiSaK7ePG2zikdZ7XoFF6VbBZyWCH2cXWG5RUn3oW",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        name: "SwapEvent",
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputMint: "So11111111111111111111111111111111111111112",
          inputAmount: 100_000n,
          outputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          outputAmount: 6039n,
        },
      },
      {
        name: "SwapEvent",
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          inputAmount: 6039n,
          outputMint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          outputAmount: 16_153n,
        },
      },
      {
        name: "SwapEvent",
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputMint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          inputAmount: 16_153n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputAmount: 15_172n,
        },
      },
    ]);
  });
  it("should parse Orca + Meteora DLMM swap", async () => {
    const tx = await getTestTransaction(
      "5MMAfqiFPqFUWXPLVE3NYy24sqtDHuRxVnnh7sWyyuizZTgvf4R6xtvPbewE6FDfce6vyKSqTHW9WNRYQj1ieLcK",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 100_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 7701n,
          outputMint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 7701n,
          inputMint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
          outputAmount: 4_809_776n,
          outputMint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputAmount: 4_809_776n,
          inputMint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
          outputAmount: 15_107n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        name: "SwapEvent",
      },
    ]);
  });
  it("should parse Raydium + Orca swap", async () => {
    const tx = await getTestTransaction(
      "1ZSq1Aa2i6ES95SRhvWedfxppiNdyaUG4o5gd3qzsSiygnJPfGWagBUEPBGGoD81MLfaru6KBH4J3ppKFphZta4",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          inputAmount: 10_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 301_729_867n,
          outputMint: "RUpbmGF6p42AAeN1QvhFReZejQry1cLkE1PUYFVVpnL",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 301_729_867n,
          inputMint: "RUpbmGF6p42AAeN1QvhFReZejQry1cLkE1PUYFVVpnL",
          outputAmount: 1607n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 1607n,
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputAmount: 12_839_349n,
          outputMint: "EwJN2GqUGXXzYmoAciwuABtorHczTA5LqbukKXV1viH7",
        },
        name: "SwapEvent",
      },
    ]);
  });
  it("should parse Lifinity + Meteora DLMM swap", async () => {
    const tx = await getTestTransaction(
      "469XLAdr6x5iQpRrRzySp8NcBnJm9SzKNHgRnx8F5gydroQPJkh5viC7P5yGta6jYW58yi9y3MJXAfVH5dJBWfbs",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
          inputAmount: 100_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 416_785n,
          outputMint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputAmount: 416_785n,
          inputMint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
          outputAmount: 10_905_411n,
          outputMint: "mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputAmount: 10_905_411n,
          inputMint: "mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6",
          outputAmount: 16_248n,
          outputMint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        },
        name: "SwapEvent",
      },
    ]);
  });
  it("should parse Lifinity + Meteora DLMM + Orca swap", async () => {
    const tx = await getTestTransaction(
      "2ZiXFzYVAaxBEoZfRP9s4vap4skREgNDzFZUga8Kcdd6SQtigs4a5f5LHpB5iYcw84yF4PKqR3EuVb7ex4fK8kMz",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
          inputAmount: 100_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 5992n,
          outputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputAmount: 5992n,
          inputMint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
          outputAmount: 14_509n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 14_509n,
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputAmount: 39_649n,
          outputMint: "A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ",
        },
        name: "SwapEvent",
      },
    ]);
  });
  it("should parse single swap", async () => {
    const tx = await getTestTransaction(
      "ndGjRockP4jDGo4uJiR97gP7vRCYBDCTU2JYMHzJPZNTwpdGxtJb3KbuBXB4DQ93shQj4Tqy99QCEJmJVDNnBAw",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
          inputAmount: 10_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 1512n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        name: "SwapEvent",
      },
    ]);
  });
  it("should parse swap to SOL", async () => {
    const tx = await getTestTransaction(
      "3SevEqRaimXB8hgPD9QGmZTWMK2Tjc4D3LX4wQYbheamQtyh2XSaKzSrft155GA9HzADkPwD76FxZxg4dm5hksrq",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 41_143n,
          inputMint: "A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ",
          outputAmount: 118_611n,
          outputMint: "HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 118_611n,
          inputMint: "HaP8r3ksG76PhQLTqR8FYBeNiQpejcFbQmiHbg787Ut1",
          outputAmount: 28_779_309_773n,
          outputMint: "3dN3iSG9SciKQzUS5cdQ2Jphmv4ynhhdfMbEt9eKYsNw",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          inputAmount: 28_779_309_773n,
          inputMint: "3dN3iSG9SciKQzUS5cdQ2Jphmv4ynhhdfMbEt9eKYsNw",
          outputAmount: 98_996n,
          outputMint: "So11111111111111111111111111111111111111112",
        },
        name: "SwapEvent",
      },
    ]);
  });
  it("should parse swap between spl tokens", async () => {
    const tx = await getTestTransaction(
      "3oweJMyjtMAmoyE23XAwszJQESaoagbh2W2UqUjUBtHGhexAL477qN767Sq8CdBfREka6diiY3aT8xkLvcdkPSWL",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          inputAmount: 1_000_000n,
          inputMint: "A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ",
          outputAmount: 2_483_471n,
          outputMint: "So11111111111111111111111111111111111111112",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          inputAmount: 2_483_471n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 1_706_275_010n,
          outputMint: "AujTJJ7aMS8LDo3bFzoyXDwT3jBALUbu4VZhzZdTZLmG",
        },
        name: "SwapEvent",
      },
    ]);
  });

  it("should parse SPL Transfer", async () => {
    // Normally its TransferChecked
    const tx = await getTestTransaction(
      "E19UrzNeLNaNUnzb71X9tXEcheByrfY3VQvB1E7w7k5ayDuznxKq45mj4zymqnRS9FWXZP68poSBZHLxqNmUQn7",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          inputAmount: 100_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 22_344_315n,
          outputMint: "E6pBvDQAX31UzJD9cqqFx6j8Lfvo1q42FD6PAMNRpump",
        },
        name: "SwapEvent",
      },
    ]);
  });

  it("should parse SPL in TransferChecked out Transfer", async () => {
    // Normally its TransferChecked
    const tx = await getTestTransaction(
      "5Q8EMUvmvFFuWRKHEk754TXDEMNoqB2GFTdMp2S8uLQfkfZCdryWLwRJz5rDnpRfnZ6fyfFgfkchoy4UdkHpcYBz",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 100_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 41_064n,
          outputMint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB",
          inputAmount: 41_064n,
          inputMint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
          outputAmount: 32_413n,
          outputMint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 32_413n,
          inputMint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
          outputAmount: 14_507n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        name: "SwapEvent",
      },
    ]);
  });
});

describe("parse jupiter swap result", async () => {
  it("should parse SPL in TransferChecked out Transfer", async () => {
    // Normally its TransferChecked
    const tx = await getTestTransaction(
      "5Q8EMUvmvFFuWRKHEk754TXDEMNoqB2GFTdMp2S8uLQfkfZCdryWLwRJz5rDnpRfnZ6fyfFgfkchoy4UdkHpcYBz",
    );
    const events = tx.meta.innerInstructions.flatMap((inner) =>
      inner.instructions.filter(isJupiterInstruction).map(decodeJupiterEvents),
    );

    expect(events).toStrictEqual([
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 100_000n,
          inputMint: "So11111111111111111111111111111111111111112",
          outputAmount: 41_064n,
          outputMint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB",
          inputAmount: 41_064n,
          inputMint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
          outputAmount: 32_413n,
          outputMint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
        },
        name: "SwapEvent",
      },
      {
        data: {
          amm: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
          inputAmount: 32_413n,
          inputMint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
          outputAmount: 14_507n,
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        name: "SwapEvent",
      },
    ]);
  });
});
