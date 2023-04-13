import {
  createCreateMetadataAccountV2Instruction,
  CreateMetadataAccountV2InstructionArgs,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { readFileSync } from "fs";
import { utils } from "@project-serum/anchor";

const walletKeyPairFile = "HHH8R6AHb2BieuVKdguUUzSSphNYwEoThDaqDdPiqVzk.json";
const walletKeyPair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(readFileSync(walletKeyPairFile).toString()))
);

const tokenKeyPairFile = "VVVN9JRpr5GKkRuXwGTo5WteGc7ubdxDqvWyPR5sN4C.json";
const { publicKey: tokenAddress } = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(readFileSync(tokenKeyPairFile).toString()))
);

const seed1 = Buffer.from(utils.bytes.utf8.encode("metadata"));
const seed2 = Buffer.from(PROGRAM_ID.toBytes());
const seed3 = Buffer.from(tokenAddress.toBytes());

const [metadataPK] = PublicKey.findProgramAddressSync(
  [seed1, seed2, seed3],
  PROGRAM_ID
);

const accounts = {
  metadata: metadataPK,
  mint: tokenAddress,
  mintAuthority: walletKeyPair.publicKey,
  payer: walletKeyPair.publicKey,
  updateAuthority: walletKeyPair.publicKey,
};

const dataV2 = {
  name: "NNFFTT",
  symbol: "NFTT",
  //   uri: "https://shdw-drive.genesysgo.net/ArP7jjhVZsp7vkzteU7mpKA1fyHRhv4ZBz6gR7MJ1JTC/metadata.json",
  uri: "https://assets.thevalley.racingnft.com.au/saintly-1996-heroic-bronze-001-of-011/metadata.json",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const args: CreateMetadataAccountV2InstructionArgs = {
  createMetadataAccountArgsV2: {
    data: dataV2,
    isMutable: true,
  },
};

const instruction = createCreateMetadataAccountV2Instruction(accounts, args);
const transaction = new Transaction();

transaction.add(instruction);

console.log(transaction);

sendAndConfirmTransaction(
  new Connection("https://api.devnet.solana.com"),
  transaction,
  [walletKeyPair]
).then((txid) => console.log(`DONE: ${txid}`));
