/**
 * Deploy injmatch contract to Injective testnet (injective-888)
 *
 * Usage (private key — from Keplr):
 *   PRIVATE_KEY=your_hex_private_key node scripts/deploy.mjs
 *
 * Usage (mnemonic):
 *   MNEMONIC="word1 word2 ..." node scripts/deploy.mjs
 *
 * Prints the contract address — paste into NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
 * Get testnet INJ at: https://testnet.faucet.injective.network/
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const RPC    = 'https://testnet.sentry.tm.injective.network:443';
const PREFIX = 'inj';

async function main() {
  const privateKeyHex = process.env.PRIVATE_KEY;
  const mnemonic      = process.env.MNEMONIC;

  if (!privateKeyHex && !mnemonic) {
    console.error('❌  Provide credentials:');
    console.error('   PRIVATE_KEY=your_hex_key node scripts/deploy.mjs');
    console.error('   MNEMONIC="word1 word2 ..." node scripts/deploy.mjs');
    process.exit(1);
  }

  const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const { DirectSecp256k1Wallet, DirectSecp256k1HdWallet } = await import('@cosmjs/proto-signing');
  const { GasPrice } = await import('@cosmjs/stargate');

  // Build signer
  let signer;
  if (privateKeyHex) {
    const keyHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
    const keyBytes = Uint8Array.from(Buffer.from(keyHex, 'hex'));
    signer = await DirectSecp256k1Wallet.fromKey(keyBytes, PREFIX);
  } else {
    signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: PREFIX });
  }

  const [account] = await signer.getAccounts();
  console.log(`\n🔑  Deploying from: ${account.address}`);
  console.log(`🌐  Network: injective-888 (testnet)\n`);

  const client = await SigningCosmWasmClient.connectWithSigner(
    RPC,
    signer,
    { gasPrice: GasPrice.fromString('500000000inj') },
  );

  const balance = await client.getBalance(account.address, 'inj');
  const injBalance = (Number(balance.amount) / 1e18).toFixed(4);
  console.log(`💰  Balance: ${injBalance} INJ\n`);

  if (Number(balance.amount) === 0) {
    console.error('❌  No testnet INJ. Get some at: https://testnet.faucet.injective.network/');
    process.exit(1);
  }

  // ── Step 1: Upload WASM ────────────────────────────────────────────────────
  const wasmPath = join(__dir, '../contracts/artifacts/injmatch.wasm');
  const wasm = readFileSync(wasmPath);

  console.log('📦  Uploading WASM...');
  const uploadResult = await client.upload(account.address, wasm, 'auto');
  console.log(`✅  Code uploaded! code_id = ${uploadResult.codeId}`);
  console.log(`   TX: ${uploadResult.transactionHash}\n`);

  // ── Step 2: Instantiate ────────────────────────────────────────────────────
  console.log('🚀  Instantiating contract...');
  const instantiateResult = await client.instantiate(
    account.address,
    uploadResult.codeId,
    {},           // InstantiateMsg is empty
    'InjMatch v1',
    'auto',
    { admin: account.address },
  );

  const contractAddress = instantiateResult.contractAddress;
  console.log(`✅  Contract deployed!\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`CONTRACT ADDRESS:\n${contractAddress}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\nAdd to .env.local (and Vercel env vars):`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`\nTX: ${instantiateResult.transactionHash}`);
}

main().catch(err => {
  console.error('❌ ', err?.message ?? err);
  process.exit(1);
});
