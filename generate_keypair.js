import { Keypair } from "@solana/web3.js";

// Generate a new Keypair
const newKeypair = Keypair.generate();

// Get the public key
const publicKey = newKeypair.publicKey.toString();

// Get the private key
const secretKey = newKeypair.secretKey;

// Create a Keypair from a secret key
const keypairFromSecretKey = Keypair.fromSecretKey(secretKey);

// Create a Keypair from a Base58-encoded secret key
const keypairFromBase58 = Keypair.fromSecretKey(bs58.decode("your_base58_encoded_secret_key"));
