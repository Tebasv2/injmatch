/**
 * Deploy injmatch contract to Injective testnet (injective-888)
 *
 * Usage:
 *   MNEMONIC="your twelve word mnemonic phrase here" node scripts/deploy.mjs
 *
 * What it does:
 *   1. Reads contracts/artifacts/injmatch.wasm
 *   2. Broadcasts MsgStoreCode  → gets code_id
 *   3. Broadcasts MsgInstantiateContract → gets contract_address
 *   4. Prints the address — paste it into NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
 *
 * Requirements:
 *   - Wallet must have testnet INJ for gas (get from https://testnet.faucet.injective.network/)
 *   - MNEMONIC env var with the wallet seed phrase
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

async function main() {
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
    console.error('❌  Set MNEMONIC env var — your testnet wallet seed phrase');
    console.error('   MNEMONIC="word1 word2 ..." node scripts/deploy.mjs');
    process.exit(1);
  }

  // Dynamic imports — these packages are already in node_modules
  const {
    PrivateKey,
    ChainRestAuthApi,
    ChainRestTendermintApi,
    MsgStoreCode,
    MsgInstantiateContract,
    createTransactionFromMsg,
    TxRestClient,
    getInjectiveAddress,
  } = await import('@injectivelabs/sdk-ts');

  const { Network, getNetworkEndpoints } = await import('@injectivelabs/networks');

  const NETWORK   = Network.TestnetK8s;
  const ENDPOINTS = getNetworkEndpoints(NETWORK);
  const CHAIN_ID  = 'injective-888';

  // Derive wallet
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  const publicKey  = privateKey.toPublicKey();
  const injectiveAddress = getInjectiveAddress(publicKey.toAddress().address);

  console.log(`\n🔑  Deploying from: ${injectiveAddress}`);
  console.log(`🌐  Network:        ${CHAIN_ID} (testnet)\n`);

  // Load wasm
  const wasmPath = join(__dir, '../contracts/artifacts/injmatch.wasm');
  const wasm = readFileSync(wasmPath);
  const wasmBytes = new Uint8Array(wasm);

  // Fetch account info
  const authApi      = new ChainRestAuthApi(ENDPOINTS.rest);
  const tendermintApi = new ChainRestTendermintApi(ENDPOINTS.rest);

  const accountDetails = await authApi.fetchAccount(injectiveAddress);
  const chainStatus    = await tendermintApi.fetchNodeInfo();
  const sequence       = parseInt(accountDetails.baseAccount.sequence, 10);
  const accountNumber  = parseInt(accountDetails.baseAccount.accountNumber, 10);

  console.log(`📋  Account #${accountNumber}  Sequence: ${sequence}`);

  const txClient = new TxRestClient(ENDPOINTS.rest);

  // ── Step 1: Store code ──────────────────────────────────────────────────────

  console.log('📦  Storing WASM code...');

  const storeMsg = MsgStoreCode.fromJSON({
    sender: injectiveAddress,
    wasmBytes,
  });

  const { signBytes: storeSignBytes, txRaw: storeTxRaw, transaction: storeTx } =
    createTransactionFromMsg({
      sequence,
      accountNumber,
      message: storeMsg,
      chainId: CHAIN_ID,
      fee: { amount: [{ denom: 'inj', amount: '5000000000000000' }], gas: '3000000' },
      pubKey: publicKey.toBase64(),
    });

  const storeSig = await privateKey.sign(Buffer.from(storeSignBytes));
  storeTxRaw.signatures = [storeSig];

  const storeResult = await txClient.broadcast(storeTxRaw);

  if (storeResult.code !== 0) {
    console.error('❌  StoreCode failed:', storeResult.rawLog);
    process.exit(1);
  }

  // Extract code_id from logs
  const codeIdAttr = storeResult.events
    ?.flatMap(e => e.attributes)
    ?.find(a => a.key === 'code_id');
  const codeId = codeIdAttr?.value;

  if (!codeId) {
    console.error('❌  Could not find code_id in tx result');
    console.error(JSON.stringify(storeResult, null, 2));
    process.exit(1);
  }

  console.log(`✅  Code stored! code_id = ${codeId}`);
  console.log(`   TX: ${storeResult.txHash}\n`);

  // ── Step 2: Instantiate ─────────────────────────────────────────────────────

  console.log('🚀  Instantiating contract...');

  const instantiateMsg = MsgInstantiateContract.fromJSON({
    sender: injectiveAddress,
    admin: injectiveAddress,
    codeId: parseInt(codeId, 10),
    label: 'InjMatch v1',
    msg: {},   // InstantiateMsg is empty {}
    amount: { denom: 'inj', amount: '0' },
  });

  const { signBytes: instSignBytes, txRaw: instTxRaw } =
    createTransactionFromMsg({
      sequence: sequence + 1,
      accountNumber,
      message: instantiateMsg,
      chainId: CHAIN_ID,
      fee: { amount: [{ denom: 'inj', amount: '2000000000000000' }], gas: '1000000' },
      pubKey: publicKey.toBase64(),
    });

  const instSig = await privateKey.sign(Buffer.from(instSignBytes));
  instTxRaw.signatures = [instSig];

  const instResult = await txClient.broadcast(instTxRaw);

  if (instResult.code !== 0) {
    console.error('❌  Instantiate failed:', instResult.rawLog);
    process.exit(1);
  }

  // Extract contract address from logs
  const contractAttr = instResult.events
    ?.flatMap(e => e.attributes)
    ?.find(a => a.key === '_contract_address' || a.key === 'contract_address');
  const contractAddress = contractAttr?.value;

  if (!contractAddress) {
    console.error('❌  Could not find contract address in tx result');
    console.error(JSON.stringify(instResult, null, 2));
    process.exit(1);
  }

  console.log(`✅  Contract deployed!\n`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`CONTRACT ADDRESS: ${contractAddress}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\nAdd to .env.local:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`\nTX: ${instResult.txHash}`);
}

main().catch(err => {
  console.error('❌ ', err?.message ?? err);
  process.exit(1);
});
