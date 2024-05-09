const { getNwcServicePubkey } = require("../utils");
const { RELAY_URI, NWC_CONNECTION_SECRET } = require("../constants");

console.log(
  `nostr+walletconnect:${getNwcServicePubkey()}?${RELAY_URI}&secret=${NWC_CONNECTION_SECRET}`,
);
