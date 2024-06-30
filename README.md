<h1 align="center">
	<sup>AnchorES</sup>
	<!-- <br>
	<a href="https://www.npmjs.com/package/anchores"><img src="https://badgen.net/npm/v/anchores" title="NPM version"></a>
  <a href="https://pkg-size.dev/anchores"><img src="https://pkg-size.dev/badge/bundle/2067" title="Minimal Solana transaction parser."></a> -->
</h1>

Minimal library for parsing Solana transaction, instructions and events.

- Tree-shakeable: 7.82kB (3.48kB gzip) to parse Jupiter Swap Events
- ESM and commonjs
- No IDL, structs defined in code
- Typescript friendly
- Minimal dependencies

> [!WARNING]  
> **This is still a work in progress**. Support for all Borsh types is not yet implemented, and the API is subject to change.

## Install

```bash
npm i anchores
```

## Parsing Jupiter Swap Transactions

We export a `parseTransaction` function that takes a program id, a list of instruction and event parsers, and the transaction to parse.

```typescript
import { parseTransaction } from "anchores";
import { JUPITER_V6_PROGRAM_ID, SwapEvent } from "anchores/parsers/jupiter";

const tx = await connection.getParsedTransaction("txhash");
const events = parseTransaction(
  JUPITER_V6_PROGRAM_ID,
  {
    events: [SwapEvent],
  },
  tx,
);
```

See tests for other usage examples.

## Declaring your own parser

You can also declare your own parsers. Here is an example of a parser for the Jupiter Swap Event:

```typescript
import * as b from "anchores/binary";

export function parseSwapEvent(data: Uint8Array) {
  const reader = b.createReader(data);
  return {
    amm: b.publicKey(reader),
    inputMint: b.publicKey(reader),
    inputAmount: b.u64(reader),
    outputMint: b.publicKey(reader),
    outputAmount: b.u64(reader),
  };
}
export type ParsedSwapEvent = ReturnType<typeof parseSwapEvent>;
```

You can use this function directly or form a parser object to pass to `parseTransaction`, `decodeEvents`, `decodeStructs`.

```typescript
import { createSighash } from "anchores/anchor";

export const SwapEvent = {
  name: "SwapEvent" as const,
  discriminator: createSighash("event", "SwapEvent"),
  // declared above
  parse: parseSwapEvent,
};

// Usage
const events = parseTransaction(
  PROGRAM_ID,
  {
    events: [SwapEvent],
  },
  tx,
);
// or
const structs = tx.meta.innerInstructions.flatMap((inner) =>
  inner.instructions.filter(isJupiterInstruction).map((ix) => {
    const ixData = base58.decode(ix.data);
    const instruct = decodeStructs([SwapInstruction], ixData);
    if (instruct) {
      return instruct;
    }

    const event = decodeEvents([SwapEvent], ixData);
    return event;
  }),
);
```
