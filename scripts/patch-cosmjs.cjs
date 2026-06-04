/**
 * Patches @cosmjs/stargate's accountFromAny to support Injective's EthAccount type.
 * Runs automatically after npm install via postinstall in package.json.
 */

const fs   = require('fs');
const path = require('path');

const ACCOUNTS_FILE = path.join(
  __dirname, '../node_modules/@cosmjs/cosmwasm-stargate/node_modules/@cosmjs/stargate/build/accounts.js'
);

if (!fs.existsSync(ACCOUNTS_FILE)) {
  console.log('[patch-cosmjs] accounts.js not found — skipping');
  process.exit(0);
}

const content = fs.readFileSync(ACCOUNTS_FILE, 'utf8');

if (content.includes('injective.types.v1beta1.EthAccount')) {
  console.log('[patch-cosmjs] already patched');
  process.exit(0);
}

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
  console.warn('[patch-cosmjs] WARNING: pattern not found — cosmjs may have been updated');
  process.exit(0);
}

fs.writeFileSync(ACCOUNTS_FILE, patched, 'utf8');
console.log('[patch-cosmjs] patched accounts.js for Injective EthAccount support');
