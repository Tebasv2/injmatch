/**
 * Test squad save + load on Injective testnet
 *
 * Usage (private keys):
 *   CONTRACT=inj1... PRIVATE_KEY=hex1 PRIVATE_KEY2=hex2 node scripts/test-squad.mjs
 *
 * Usage (mnemonics):
 *   CONTRACT=inj1... MNEMONIC="..." MNEMONIC2="..." node scripts/test-squad.mjs
 */

const RPC    = 'https://testnet.sentry.tm.injective.network:443';
const PREFIX = 'inj';

async function main() {
  const contractAddress = process.env.CONTRACT;
  const privKey1  = process.env.PRIVATE_KEY;
  const privKey2  = process.env.PRIVATE_KEY2;
  const mnemonic1 = process.env.MNEMONIC;
  const mnemonic2 = process.env.MNEMONIC2;

  if (!contractAddress || (!privKey1 && !mnemonic1) || (!privKey2 && !mnemonic2)) {
    console.error('Usage:');
    console.error('  CONTRACT=inj1... PRIVATE_KEY=hex1 PRIVATE_KEY2=hex2 node scripts/test-squad.mjs');
    console.error('  CONTRACT=inj1... MNEMONIC="..." MNEMONIC2="..." node scripts/test-squad.mjs');
    process.exit(1);
  }

  const { SigningCosmWasmClient, CosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
  const { DirectSecp256k1Wallet, DirectSecp256k1HdWallet } = await import('@cosmjs/proto-signing');
  const { GasPrice } = await import('@cosmjs/stargate');

  async function makeSigner(keyHex, mnemonic) {
    if (keyHex) {
      const hex = keyHex.startsWith('0x') ? keyHex.slice(2) : keyHex;
      return DirectSecp256k1Wallet.fromKey(Uint8Array.from(Buffer.from(hex, 'hex')), PREFIX);
    }
    return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: PREFIX });
  }

  async function saveSquad(signer, squad) {
    const [account] = await signer.getAccounts();
    const client = await SigningCosmWasmClient.connectWithSigner(
      RPC, signer, { gasPrice: GasPrice.fromString('500000000inj') },
    );
    console.log(`\n📤  Saving squad for ${account.address}`);
    const result = await client.execute(
      account.address,
      contractAddress,
      { save_squad: { formation: squad.formation, starter_ids: squad.starter_ids, bench_ids: squad.bench_ids } },
      'auto',
    );
    console.log(`✅  Saved! TX: ${result.transactionHash}`);
    return account.address;
  }

  const queryClient = await CosmWasmClient.connect(RPC);

  async function querySquad(address) {
    return queryClient.queryContractSmart(contractAddress, { get_squad: { owner: address } });
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

  const signerA = await makeSigner(privKey1, mnemonic1);
  const signerB = await makeSigner(privKey2, mnemonic2);

  const addrA = await saveSquad(signerA, squadA);
  const addrB = await saveSquad(signerB, squadB);

  console.log('\n⏳  Waiting 3s for block...');
  await new Promise(r => setTimeout(r, 3000));

  console.log('\n📥  Querying squads...\n');

  const resultA = await querySquad(addrA);
  const resultB = await querySquad(addrB);

  console.log(`Wallet A (${addrA.slice(0, 20)}…):`);
  console.log(`  Formation: ${resultA.formation}`);
  console.log(`  Starters:  ${resultA.starter_ids.join(', ')}`);
  console.log(`  Bench:     ${resultA.bench_ids.join(', ')}`);

  console.log(`\nWallet B (${addrB.slice(0, 20)}…):`);
  console.log(`  Formation: ${resultB.formation}`);
  console.log(`  Starters:  ${resultB.starter_ids.join(', ')}`);
  console.log(`  Bench:     ${resultB.bench_ids.join(', ')}`);

  const pass = resultA.starter_ids[0] === squadA.starter_ids[0]
            && resultB.starter_ids[0] === squadB.starter_ids[0]
            && resultA.formation !== resultB.formation;

  console.log('\n' + (pass
    ? '🎉  PASS — squads stored independently per wallet'
    : '❌  FAIL — check results above'));
}

main().catch(err => {
  console.error('❌ ', err?.message ?? err);
  process.exit(1);
});
