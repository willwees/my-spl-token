import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  createMint,
  getMint,
  createAssociatedTokenAccount,
  getAccount,
  mintToChecked,
  transferChecked,
} from "@solana/spl-token";

(async () => {
  // create connection
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  // const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const connection = new Connection("https://testnet.dev2.eclipsenetwork.xyz", "confirmed");
  const recentBlockhash = await connection.getLatestBlockhash();
  console.log(`blockhash: ${recentBlockhash.blockhash}, blockheight: ${recentBlockhash.lastValidBlockHeight}`);

  // HyCLpEtgDPFJ8x7hqtpiqeRvmaUjY4Z3cVbQMoxEqagg
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "LWQcwvMdJARdxxxxxxUEaS3aUhYziC"
    ),
  );

  // 9FA729sQa5fcWSVqkYsCiKoLbXA4jNhar5u4PHUJeDAn
  const alice = Keypair.fromSecretKey(
    bs58.decode(
      "5skLhbvDBR9CexxxxxxUMgDqkX7voAkMc",
    ),
  );

  // 1.1 create mint account
  let mintPubkey = await createMint(
    connection, // conneciton
    feePayer, // fee payer
    alice.publicKey, // mint authority
    alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    8, // decimals
  );
  console.log(`mintPubkey: ${mintPubkey.toBase58()}`);

  // 1.2 get mint account info
  let mintInfo = await getMint(connection, mintPubkey);
  
  console.log(`mintInfo: ${mintInfo}`);

  // 2.1 create associated token account - ata
  let ata = await createAssociatedTokenAccount(
    connection, // connection
    feePayer, // fee payer
    mintPubkey, // mint address
    alice.publicKey, // owner of the ata
  );
  console.log(`feePayer: ${feePayer.publicKey.toBase58()}, mint: ${mintPubkey.toBase58()}, alice: ${alice.publicKey.toBase58()}, ATA: ${ata.toBase58()}`);

  // 2.2 get associated token amount
  let tokenAmount = await connection.getTokenAccountBalance(ata);
  console.log(`tokenAmount: ${JSON.stringify(tokenAmount)}`);

  // 2.3 get associated token account info
  let tokenAccount = await getAccount(connection, ata);
  console.log(`tokenAccount: ${tokenAccount}`);

  // 3.1 mint tokens to ata
  let txHash = await mintToChecked(
    connection, // connection
    feePayer, // fee payer
    mintPubkey, // mint address
    ata, // ata address
    alice, // mint authority
    2 * 1e8, // amount. if your decimals is 8, you mint 10^8 for 1 token.
    8, // decimals
  );
  console.log(`txHash: ${txHash}`);

  // 4 transfer token
  const bob = new PublicKey(
    "212EXZtALYXDQ2VT1hQeMPM41bmovL7t6MTxsxQbxZp9"
  );

  let ata_bob = await createAssociatedTokenAccount(
    connection, // connection
    feePayer, // fee payer
    mintPubkey, // mint address
    bob, // owner of the ata
  );
  console.log(`bob: ${bob.toBase58()}, ATA: ${ata_bob.toBase58()}`);

  let trans_txHash = await transferChecked(
    connection, // connection
    feePayer, // fee payer
    ata, // source ata address
    mintPubkey, // mint address
    ata_bob, // destination ata address
    alice, // owner of the source ata
    1 * 1e8, // amount. if your decimals is 8, you transfer 10^8 for 1 token.
    8, // decimals
  );
  console.log(`transfer txHash: https://explorer.dev.eclipsenetwork.xyz/tx/${trans_txHash}/?cluster=testnet, bob: ${bob.toBase58()}, ata_bob: ${ata_bob.toBase58()}`);
})();