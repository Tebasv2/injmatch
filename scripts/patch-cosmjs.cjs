/**
 * Patches @cosmjs to support Injective:
 *  1. accountFromAny: adds EthAccount type support
 *  2. fromBase64: Injective RPC returns unpadded base64 — adds padding before decode
 */

const fs   = require('fs');
const path = require('path');

// ── Patch 1: EthAccount ──────────────────────────────────────────────────────

const ACCOUNTS_FILE = path.join(
  __dirname, '../node_modules/@cosmjs/cosmwasm-stargate/node_modules/@cosmjs/stargate/build/accounts.js'
);

if (!fs.existsSync(ACCOUNTS_FILE)) {
  console.log('[patch-cosmjs] accounts.js not found — skipping EthAccount patch');
} else {
  const content = fs.readFileSync(ACCOUNTS_FILE, 'utf8');

  if (content.includes('injective.types.v1beta1.EthAccount')) {
    console.log('[patch-cosmjs] EthAccount patch: already applied');
  } else {
    const ethCase = `        case "/injective.types.v1beta1.EthAccount": {
            const bytes = value; let offset = 0;
            if (bytes[offset] !== 0x0a) throw new Error("bad EthAccount encoding");
            offset++;
            let len = 0, shift = 0;
            while (offset < bytes.length) { const b = bytes[offset++]; len |= (b & 0x7f) << shift; if (!(b & 0x80)) break; shift += 7; }
            return accountFromBaseAccount(auth_1.BaseAccount.decode(bytes.slice(offset, offset + len)));
        }
        default:
            throw new Error(\`Unsupported type: '\${typeUrl}'\`);`;

    const patched = content.replace(
      `        default:\n            throw new Error(\`Unsupported type: '\${typeUrl}'\`);`,
      ethCase
    );

    if (patched === content) {
      console.warn('[patch-cosmjs] EthAccount patch: pattern not found — cosmjs may have been updated');
    } else {
      fs.writeFileSync(ACCOUNTS_FILE, patched, 'utf8');
      console.log('[patch-cosmjs] EthAccount patch: applied');
    }
  }
}

// ── Patch 2: fromBase64 padding (all copies) ─────────────────────────────────
// Injective's Tendermint RPC returns url-safe / unpadded base64 in responses.
// Must patch every nested copy of @cosmjs/encoding, not just the top-level one.

const BASE64_FILES = [
  '../node_modules/@cosmjs/encoding/build/base64.js',
  '../node_modules/@cosmjs/proto-signing/node_modules/@cosmjs/encoding/build/base64.js',
  '../node_modules/@cosmjs/tendermint-rpc/node_modules/@cosmjs/encoding/build/base64.js',
  '../node_modules/@cosmjs/stargate/node_modules/@cosmjs/encoding/build/base64.js',
].map(p => path.join(__dirname, p));

for (const BASE64_FILE of BASE64_FILES) {
  if (!fs.existsSync(BASE64_FILE)) continue;
  const content = fs.readFileSync(BASE64_FILE, 'utf8');
  if (content.includes('pad_injective_fix')) {
    console.log(`[patch-cosmjs] fromBase64 patch: already applied (${path.basename(path.dirname(path.dirname(path.dirname(BASE64_FILE))))})` );
    continue;
  }
  const patched = content.replace(
    'function fromBase64(base64String) {',
    `function fromBase64(base64String) {\n    // pad_injective_fix\n    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');\n    while (base64String.length % 4 !== 0) base64String += '=';`
  );
  if (patched === content) {
    console.warn(`[patch-cosmjs] fromBase64 patch: pattern not found in ${BASE64_FILE}`);
  } else {
    fs.writeFileSync(BASE64_FILE, patched, 'utf8');
    console.log(`[patch-cosmjs] fromBase64 patch: applied to ${BASE64_FILE.split('node_modules/')[1]}`);
  }
}
