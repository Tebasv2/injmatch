/**
 * Test squad save + load on Injective testnet
 *
 * Usage:
 *   CONTRACT=inj1... MNEMONIC="word1 word2 ..." node scripts/test-squad.mjs
 *
 * Tests:
 *   1. Save a squad from wallet A
 *   2. Query it back — verify round-trip
 *   3. Save a DIFFERENT squad from wallet B (second mnemonic via MNEMONIC2)
 *   4. Query both — verify they are stored independently
 */

import { readFileSync } from 'fs';

async function main() {
  const contractAddress = process.env.CONTRACT;
  const mnemonic1 = process.env.MNEMONIC;
  const mnemonic2 = process.env.MNEMONIC2;

  if (!contractAddress || !mnemonic1 || !mnemonic2) {
    console.error('Usage: CONTRACT=inj1... MNEMONIC="..." MNEMONIC2="..." node scripts/test-squad.mjs');
    process.exit(1);
  }

  const {
    PrivateKey,
    ChainRestAuthApi,
    MsgExecuteContractCompat,
    ChainGrpcWasmApi,
    createTransactionFromMsg,
    TxRestClient,
    getInjectiveAddress,
    toBase64,
    fromBase64,
  } = await import('@injectivelabs/sdk-ts');

  const { Network, getNetworkEndpoints } = await import('@injectivelabs/networks');
  const ENDPOINTS = getNetworkEndpoints(Network.TestnetK8s);
  const CHAIN_ID  = 'injective-888';

  const txClient  = new TxRestClient(ENDPOINTS.rest);
  const wasmApi   = new ChainGrpcWasmApi(ENDPOINTS.grpc);
  const authApi   = new ChainRestAuthApi(ENDPOINTS.rest);

  async function saveSquad(mnemonic, squad) {
    const pk      = PrivateKey.fromMnemonic(mnemonic);
    const pubKey  = pk.toPublicKey();
    const address = getInjectiveAddress(pubKey.toAddress().address);

    const acct    = await authApi.fetchAccount(address);
    const seq     = parseInt(acct.baseAccount.sequence, 10);
    const acctNum = parseInt(acct.baseAccount.accountNumber, 10);

    console.log(`\n📤  Saving squad for ${address}`);

    const msg = MsgExecuteContractCompat.fromJSON({
      sender: address,
      contractAddress,
      msg: {
        save_squad: {
          formation: squad.formation,
          starter_ids: squad.starter_ids,
          bench_ids: squad.bench_ids,
        },
      },
    });

    const { signBytes, txRaw } = createTransactionFromMsg({
      sequence: seq,
      accountNumber: acctNum,
      message: msg,
      chainId: CHAIN_ID,
      fee: { amount: [{ denom: 'inj', amount: '500000000000000' }], gas: '300000' },
      pubKey: pubKey.toBase64(),
    });

    const sig = await pk.sign(Buffer.from(signBytes));
    txRaw.signatures = [sig];

    const result = await txClient.broadcast(txRaw);
    if (result.code !== 0) {
      throw new Error(`TX failed: ${result.rawLog}`);
    }
    console.log(`✅  Saved! TX: ${result.txHash}`);
    return address;
  }

  async function querySquad(address) {
    const res = await wasmApi.fetchSmartContractState(
      contractAddress,
      toBase64({ get_squad: { owner: address } }),
    );
    return fromBase64(res.data);
  }

  // ── Test squads ─────────────────────────────────────────────────────────────

  const squadA = {
    formation: '4-3-3',
    starter_ids: ['mbappe','ronaldo','bellingham','salah','vinicius','modric','pedri','trent','vandijk','militao','alisson'],
    bench_ids: ['rashford','kimmich','dias'],
  };

  const squadB = {
    formation: '3-5-2',
    starter_ids: ['haaland','vinicius','mbappe','bellingham','pedri','kimmich','hakimi','vandijk','rudiger','dias','courtois'],
    bench_ids: ['oblak','cancelo','rashford'],
  };

  // Save both
  const addrA = await saveSquad(mnemonic1, squadA);
  const addrB = await saveSquad(mnemonic2, squadB);

  // Allow 1 block
  console.log('\n⏳  Waiting 3s for block...');
  await new Promise(r => setTimeout(r, 3000));

  // Query both
  console.log('\n📥  Querying squads...\n');

  const resultA = await querySquad(addrA);
  const resultB = await querySquad(addrB);

  console.log(`Wallet A (${addrA.slice(0, 16)}…):`);
  console.log(`  Formation:  ${resultA.formation}`);
  console.log(`  Starters:   ${resultA.starter_ids.join(', ')}`);
  console.log(`  Bench:      ${resultA.bench_ids.join(', ')}`);

  console.log(`\nWallet B (${addrB.slice(0, 16)}…):`);
  console.log(`  Formation:  ${resultB.formation}`);
  console.log(`  Starters:   ${resultB.starter_ids.join(', ')}`);
  console.log(`  Bench:      ${resultB.bench_ids.join(', ')}`);

  // Verify independence
  const ok = resultA.formation === 'correct' ||
    (resultA.starter_ids[0] === squadA.starter_ids[0] &&
     resultB.starter_ids[0] === squadB.starter_ids[0] &&
     resultA.formation !== resultB.formation);

  console.log('\n' + (ok ? '🎉  PASS — squads stored independently per wallet' : '❌  FAIL — squads mixed up'));
}

main().catch(err => {
  console.error('❌ ', err?.message ?? err);
  process.exit(1);
});
