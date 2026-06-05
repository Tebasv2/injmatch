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

// ── Patch 2: fromBase64 padding ──────────────────────────────────────────────
// Injective's Tendermint RPC returns unpadded base64 in response fields.
// base64-js throws "Invalid string. Length must be a multiple of 4" unless padded.

const BASE64_FILE = path.join(
  __dirname, '../node_modules/@cosmjs/encoding/build/base64.js'
);

if (!fs.existsSync(BASE64_FILE)) {
  console.log('[patch-cosmjs] base64.js not found — skipping fromBase64 patch');
} else {
  const content = fs.readFileSync(BASE64_FILE, 'utf8');

  if (content.includes('pad_injective_fix')) {
    console.log('[patch-cosmjs] fromBase64 patch: already applied');
  } else {
    // Replace the fromBase64 function to add padding before decoding
    const original = `function fromBase64(base64String) {
    if (!base64String.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
        throw new Error("Invalid base64 string format");
    }
    return base64js.toByteArray(base64String);
}`;

    const replacement = `function fromBase64(base64String) {
    // pad_injective_fix: Injective RPC may return url-safe or unpadded base64
    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
    while (base64String.length % 4 !== 0) base64String += '=';
    if (!base64String.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
        const bad = [...new Set(base64String.replace(/[a-zA-Z0-9+/=]/g, ''))].join('');
        console.error('[fromBase64-debug] bad chars:', JSON.stringify(bad), '| hex:', Buffer.from(bad).toString('hex'));
        throw new Error("Invalid base64 string format");
    }
    return base64js.toByteArray(base64String);
}`;

    const patched = content.replace(original, replacement);

    if (patched === content) {
      console.warn('[patch-cosmjs] fromBase64 patch: pattern not found — cosmjs version may differ');
      // Try a more lenient replacement
      const lenientPatched = content.replace(
        'function fromBase64(base64String) {',
        `function fromBase64(base64String) {\n    // pad_injective_fix\n    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');\n    while (base64String.length % 4 !== 0) base64String += '=';`
      );
      if (lenientPatched !== content) {
        fs.writeFileSync(BASE64_FILE, lenientPatched, 'utf8');
        console.log('[patch-cosmjs] fromBase64 patch: applied (lenient)');
      } else {
        console.warn('[patch-cosmjs] fromBase64 patch: could not apply');
      }
    } else {
      fs.writeFileSync(BASE64_FILE, patched, 'utf8');
      console.log('[patch-cosmjs] fromBase64 patch: applied');
    }
  }
}
