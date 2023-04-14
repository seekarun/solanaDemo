import {
  createCreateMetadataAccountV2Instruction,
  CreateMetadataAccountV2InstructionArgs,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { readFileSync } from "fs";
import { utils } from "@project-serum/anchor";

const walletKeyPairFile = "AAAYcjF1JhRbtQ5k74puF7dK9MTNuqaPDPBXWDozLAtN.json";
const walletKeyPair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(readFileSync(walletKeyPairFile).toString()))
);

const tokenKeyPairFile = "NFTbvRD82Jn8BPAS89CySpP1oVPZXq5hu8ZXQV35pAy.json";
const tokenKeyPair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(readFileSync(tokenKeyPairFile).toString()))
);

const seed1 = Buffer.from(utils.bytes.utf8.encode("metadata"));
const seed2 = Buffer.from(PROGRAM_ID.toBytes());
const seed3 = Buffer.from(tokenKeyPair.publicKey.toBytes());

const [metadataPK] = PublicKey.findProgramAddressSync(
  [seed1, seed2, seed3],
  PROGRAM_ID
);

const accounts = {
  metadata: metadataPK,
  mint: tokenKeyPair.publicKey,
  mintAuthority: walletKeyPair.publicKey,
  payer: walletKeyPair.publicKey,
  updateAuthority: walletKeyPair.publicKey,
};

const creators = [
  {
    address: walletKeyPair.publicKey,
    share: 100,
    verified: true,
  },
];

const tokenData = {
  name: "LexiCoin",
  symbol: "LXC",
  uri: "https://raw.githubusercontent.com/seekarun/solanaDemo/main/assets/metadata.json",
  creators: null,
  // name: "SuperNFT",
  // symbol: "SNFT",
  // uri: "https://raw.githubusercontent.com/seekarun/solanaDemo/main/assets/nft_metadata.json",
  // creators,
  sellerFeeBasisPoints: 0,
  collection: null,
  uses: null,
};

const args: CreateMetadataAccountV2InstructionArgs = {
  createMetadataAccountArgsV2: {
    data: tokenData,
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
