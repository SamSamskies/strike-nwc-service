const { generateSecretKey } = require("nostr-tools/pure");
const { bytesToHex } = require("@noble/hashes/utils");

console.log(`private key: ${bytesToHex(generateSecretKey())}`);
