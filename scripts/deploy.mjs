/**
 * Deploy injmatch contract to Injective testnet (injective-888)
 *
 * Usage (private key — from Keplr):
 *   PRIVATE_KEY=your_hex_private_key node scripts/deploy.mjs
 *
 * Usage (mnemonic):
 *   MNEMONIC="word1 word2 ..." node scripts/deploy.mjs
 *
 * Get testnet INJ at: https://testnet.faucet.injective.network/
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Intercept ALL errors to get full stack traces (helps diagnose Injective compat issues)
const _origEmit = process.emit.bind(process);
process.emit = function(event, ...args) {
  if (event === 'uncaughtException' || event === 'unhandledRejection') {
    const err = args[0];
    console.error('\n🔍 FULL STACK TRACE:');
    console.error(err?.stack || err);
  }
  return _origEmit(event, ...args);
};
const __dir   = dirname(fileURLToPath(import.meta.url));
const RPC     = 'https://testnet.sentry.tm.injective.network:443';
const PREFIX  = 'inj';

async function main() {
  const privateKeyHex = process.env.PRIVATE_KEY;
  const mnemonic      = process.env.MNEMONIC;

  if (!privateKeyHex && !mnemonic) {
    console.error('❌  Provide credentials:');
    console.error('   PRIVATE_KEY=your_hex_key node scripts/deploy.mjs');
    console.error('   MNEMONIC="word1 word2 ..." node scripts/deploy.mjs');
    process.exit(1);
  }

  const { SigningCosmWasmClient }  = await import('@cosmjs/cosmwasm-stargate');
  const { DirectSecp256k1Wallet, DirectSecp256k1HdWallet } = await import('@cosmjs/proto-signing');
  const { GasPrice } = await import('@cosmjs/stargate');
  // EthAccount support is patched into cosmjs via scripts/patch-cosmjs.cjs

  // ── Build signer ──────────────────────────────────────────────────────────────
  let signer;
  if (privateKeyHex) {
    const hex      = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
    const keyBytes = Uint8Array.from(Buffer.from(hex, 'hex'));
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
  const injBal  = (Number(balance.amount) / 1e18).toFixed(4);
  console.log(`💰  Balance: ${injBal} INJ\n`);

  if (Number(balance.amount) === 0) {
    console.error('❌  No testnet INJ. Get some at: https://testnet.faucet.injective.network/');
    process.exit(1);
  }

  // ── Upload WASM ───────────────────────────────────────────────────────────────
  const pako      = require('pako');
  const { MsgStoreCode } = require('cosmjs-types/cosmwasm/wasm/v1/tx');

  const wasm       = readFileSync(join(__dir, '../contracts/artifacts/injmatch_lowered.wasm'));
  const compressed = pako.gzip(wasm, { level: 9 });
  console.log(`📦  Uploading WASM (${(wasm.length/1024).toFixed(1)} KB raw → ${(compressed.length/1024).toFixed(1)} KB gzipped)...`);

  const uploadFee = {
    amount: [{ denom: 'inj', amount: '50000000000000000' }],
    gas: '75000000',
  };
  const storeMsg = {
    typeUrl: '/cosmwasm.wasm.v1.MsgStoreCode',
    value: MsgStoreCode.fromPartial({ sender: account.address, wasmByteCode: compressed }),
  };
  const uploadTxResult = await client.signAndBroadcast(account.address, [storeMsg], uploadFee);
  console.log(`   TX: ${uploadTxResult.transactionHash}`);
  console.log(`   Raw log: ${uploadTxResult.rawLog?.slice(0, 200)}`);

  // Decode attribute key/value — tendermint34 returns Uint8Array bytes, not strings
  function decodeAttr(v) {
    if (!v) return '';
    if (v instanceof Uint8Array || Buffer.isBuffer(v)) return Buffer.from(v).toString('utf8');
    return String(v);
  }

  // Print all events
  console.log('   Events:');
  for (const ev of (uploadTxResult.events || [])) {
    const attrs = (ev.attributes || []).map(a => `${decodeAttr(a.key)}=${decodeAttr(a.value)}`).join(', ');
    console.log(`     [${ev.type}] ${attrs}`);
  }

  // Extract code_id from events
  let codeId = null;
  for (const ev of (uploadTxResult.events || [])) {
    for (const attr of (ev.attributes || [])) {
      if (decodeAttr(attr.key) === 'code_id') { codeId = decodeAttr(attr.value); break; }
    }
    if (codeId) break;
  }
  // Fallback: parse rawLog
  if (!codeId && uploadTxResult.rawLog) {
    const m = uploadTxResult.rawLog.match(/"code_id","value":"(\d+)"|"code_id":"(\d+)"|code_id[^\d]*(\d+)/);
    if (m) codeId = m[1] || m[2] || m[3];
  }
  if (!codeId) {
    console.error('❌  Could not extract code_id.');
    process.exit(1);
  }
  console.log(`✅  Code uploaded! code_id = ${codeId}\n`);

  // ── Instantiate ───────────────────────────────────────────────────────────────
  console.log('🚀  Instantiating contract...');
  const instantiateFee = {
    amount: [{ denom: 'inj', amount: '5000000000000000' }], // 0.005 INJ
    gas: '10000000', // 10M gas for instantiate
  };
  const instantiateResult = await client.instantiate(
    account.address,
    Number(codeId),
    {},
    'InjMatch v1',
    instantiateFee,
    { admin: account.address },
  );

  console.log(`\n✅  Contract deployed!\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`CONTRACT ADDRESS:\n${instantiateResult.contractAddress}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\nAdd to .env.local and Vercel env vars:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${instantiateResult.contractAddress}`);
  console.log(`\nTX: ${instantiateResult.transactionHash}`);
}

main().catch(err => {
  console.error('❌ ', err?.message ?? err);
  console.error('\n🔍 Stack:', err?.stack);
  process.exit(1);
});
