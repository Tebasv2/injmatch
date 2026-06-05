/**
 * Patches @cosmjs to support Injective:
 *  1. accountFromAny: adds EthAccount type support
 *  2. fromBase64: Injective RPC returns unpadded/url-safe base64 — adds padding/normalization
 *  3. responses.js: replaces all fromBase64 calls with a safe decoder that never throws
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

// ── Patch 3: responses.js safe decoder ──────────────────────────────────────
// Replace ALL fromBase64 calls in Tendermint RPC response decoders with a
// safe version that never throws — Injective returns non-standard data fields.

const SAFE_DECODER = `// injective_fix: safe base64 decode that handles unpadded/url-safe base64
function safeFromBase64(s) {
    if (!s) return new Uint8Array(0);
    try {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4 !== 0) s += '=';
        return (0, encoding_1.fromBase64)(s);
    } catch(e) {
        return Buffer.from(s, 'base64');
    }
}
`;

const RESPONSES_FILES = [
  '../node_modules/@cosmjs/cosmwasm-stargate/node_modules/@cosmjs/tendermint-rpc/build/comet38/adaptor/responses.js',
  '../node_modules/@cosmjs/cosmwasm-stargate/node_modules/@cosmjs/tendermint-rpc/build/tendermint34/adaptor/responses.js',
  '../node_modules/@cosmjs/tendermint-rpc/build/comet38/adaptor/responses.js',
  '../node_modules/@cosmjs/tendermint-rpc/build/comet1/adaptor/responses.js',
  '../node_modules/@cosmjs/tendermint-rpc/build/tendermint34/adaptor/responses.js',
].map(p => path.join(__dirname, p));

for (const RESP_FILE of RESPONSES_FILES) {
  if (!fs.existsSync(RESP_FILE)) continue;
  const content = fs.readFileSync(RESP_FILE, 'utf8');
  if (content.includes('injective_fix')) {
    console.log(`[patch-cosmjs] responses patch: already applied (${RESP_FILE.split('node_modules/')[1].split('/')[0]})`);
    continue;
  }
  let patched = content.replace(
    'const encoding_1 = require("@cosmjs/encoding");',
    'const encoding_1 = require("@cosmjs/encoding");\n' + SAFE_DECODER,
  );
  patched = patched.replace(/\(0, encoding_1\.fromBase64\)/g, 'safeFromBase64');
  if (patched === content) {
    console.warn(`[patch-cosmjs] responses patch: pattern not found in ${RESP_FILE}`);
  } else {
    fs.writeFileSync(RESP_FILE, patched, 'utf8');
    console.log(`[patch-cosmjs] responses patch: applied to ${RESP_FILE.split('node_modules/')[1]}`);
  }
}
