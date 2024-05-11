const {
  RELAY_URI,
  NWC_SERVICE_PUBKEY,
  NWC_CONNECTION_SECRET,
} = require("../constants");

console.log(
  `nostr+walletconnect://${NWC_SERVICE_PUBKEY}?relay=${RELAY_URI}&secret=${NWC_CONNECTION_SECRET}`,
);
