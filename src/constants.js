require("dotenv").config();

const STRIKE_API_KEY = process.env.STRIKE_API_KEY;
const STRIKE_SOURCE_CURRENCY = process.env.STRIKE_SOURCE_CURRENCY;
const NWC_SERVICE_PRIVKEY = process.env.NWC_SERVICE_PRIVKEY;
const RELAY_URI = process.env.RELAY_URI;
const AUTHORIZED_PUBKEY = process.env.AUTHORIZED_PUBKEY;
const NWC_CONNECTION_SECRET = process.env.NWC_CONNECTION_SECRET;
const TOTAL_MAX_SEND_AMOUNT_IN_SATS =
  process.env.TOTAL_MAX_SEND_AMOUNT_IN_SATS ?? 10000;

if (!STRIKE_API_KEY) {
  console.log("Missing STRIKE_API_KEY in .env file.");
  process.exit(1);
}

if (!STRIKE_SOURCE_CURRENCY) {
  console.log("Missing STRIKE_SOURCE_CURRENCY in .env file.");
  process.exit(1);
}

if (!NWC_SERVICE_PRIVKEY) {
  console.log("Missing NWC_SERVICE_PRIVKEY in .env file.");
  console.log(
    "You can run `npm run generate-secret` to create a new private key.",
  );
  process.exit(1);
}

if (!RELAY_URI) {
  console.log("Missing RELAY_URI in .env file");
  process.exit(1);
}

if (!AUTHORIZED_PUBKEY) {
  console.log("Missing AUTHORIZED_PUBKEY in .env file");
  process.exit(1);
}

if (!NWC_CONNECTION_SECRET) {
  console.log("Missing NWC_CONNECTION_SECRET in .env file");
  console.log(
    "You can run `npm run generate-secret` to create a new connection secret.",
  );
  process.exit(1);
}

module.exports = {
  STRIKE_API_KEY,
  STRIKE_SOURCE_CURRENCY,
  NWC_SERVICE_PRIVKEY,
  RELAY_URI,
  AUTHORIZED_PUBKEY,
  NWC_CONNECTION_SECRET,
  TOTAL_MAX_SEND_AMOUNT_IN_SATS,
};
