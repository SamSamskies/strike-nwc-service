const { getPublicKey } = require("nostr-tools/pure");
const { NWC_SERVICE_PRIVKEY } = require("./constants");

const getNwcServicePubkey = () => getPublicKey(NWC_SERVICE_PRIVKEY);

module.exports = {
  getNwcServicePubkey,
};
