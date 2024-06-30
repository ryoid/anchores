import {
  Connection,
  type ParsedInnerInstruction,
  type ParsedInstruction,
  type ParsedTransactionMeta,
  type ParsedTransactionWithMeta,
  type PartiallyDecodedInstruction,
} from "@solana/web3.js";
import fs from "node:fs/promises";

const connection = new Connection("https://rproxy.coinhall.org/solana");

type ParsedTransactionWithInnerInstructions = ParsedTransactionWithMeta & {
  meta: ParsedTransactionMeta & {
    innerInstructions: ParsedInnerInstruction[];
  };
};

/**
 * Read from testdata or fetch and save if not found
 */
export async function getTransactionAndSave(
  txHash: string,
  dir: string,
): Promise<ParsedTransactionWithInnerInstructions> {
  try {
    const events = JSON.parse(
      await fs.readFile(`${dir}/${txHash}.json`, "utf8"),
    ) as ParsedTransactionWithInnerInstructions;
    return events;
  } catch {
    const tx = await connection.getParsedTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });
    if (!tx) {
      throw new Error("Transaction not found");
    }
    if (!tx.meta?.innerInstructions) {
      throw new Error("No inner instructions");
    }
    await fs.writeFile(`${dir}/${txHash}.json`, JSON.stringify(tx), "utf8");
    return tx as ParsedTransactionWithInnerInstructions;
  }
}

export const isPartialProgramInstruction =
  (programId: string) =>
  (
    ix: ParsedInstruction | PartiallyDecodedInstruction,
  ): ix is PartiallyDecodedInstruction => {
    if (
      ix.programId.toString() !== programId ||
      // Should not be ParsedInstruction
      !("data" in ix)
    ) {
      return false;
    }
    return true;
  };
