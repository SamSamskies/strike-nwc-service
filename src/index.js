const lightBolt11Decoder = require("light-bolt11-decoder");
const { finalizeEvent } = require("nostr-tools/pure");
const { useWebSocketImplementation, Relay } = require("nostr-tools/relay");
const { NWCWalletRequest, NWCWalletResponse } = require("nostr-tools/kinds");
const { encrypt, decrypt } = require("nostr-tools/nip04");
const {
  RELAY_URI,
  TOTAL_MAX_SEND_AMOUNT_IN_SATS,
  NWC_CONNECTION_PUBKEY,
  NWC_CONNECTION_SECRET,
  NWC_SERVICE_PUBKEY,
  AUTHORIZED_PUBKEY,
} = require("./constants");
const { payInvoice } = require("./strike");

useWebSocketImplementation(require("ws"));

let totalAmountSentInSats = 0;
const supportedResultTypes = {
  payInvoice: "pay_invoice",
};
const UNAUTHORIZED = "UNAUTHORIZED";
const NOT_IMPLEMENTED = "NOT_IMPLEMENTED";
const QUOTA_EXCEEDED = "QUOTA_EXCEEDED";
const PAYMENT_FAILED = "PAYMENT_FAILED";

const start = async () => {
  const relay = await Relay.connect(RELAY_URI);
  console.log(`connected to ${RELAY_URI}`);

  relay.subscribe(
    [
      {
        authors: [NWC_CONNECTION_PUBKEY],
        kinds: [NWCWalletRequest],
      },
    ],
    {
      onevent(event) {
        console.log("NWC request:", event);
        handleNwcRequest(relay, event);
      },
    },
    {
      onclose(reason) {
        console.log("Relay subscription closed: ", reason);
      },
    },
  );
};

const decryptNwcRequestContent = async (eventContent) => {
  try {
    return JSON.parse(
      await decrypt(NWC_CONNECTION_SECRET, NWC_SERVICE_PUBKEY, eventContent),
    );
  } catch (err) {
    throw new Error(UNAUTHORIZED);
  }
};

const getErrorMessage = ({ requestMethod, errorCode }) => {
  switch (errorCode) {
    case UNAUTHORIZED:
      return "Unable to decrypt NWC request content.";
    case NOT_IMPLEMENTED:
      return `${requestMethod} not currently supported.`;
    case QUOTA_EXCEEDED:
      return `Payment would exceed max quota of ${TOTAL_MAX_SEND_AMOUNT_IN_SATS}.`;
    case PAYMENT_FAILED:
      return "Unable to complete payment.";
    default:
      return "Something unexpected happened.";
  }
};

const makeNwcResponseEvent = async ({ eventId, requestMethod, errorCode }) => {
  const content = { result_type: requestMethod };

  if (errorCode) {
    content.error = {
      code: errorCode,
      message: getErrorMessage({ requestMethod, errorCode }),
    };
  } else {
    content.result = {
      preimage: "gfy",
    };
  }
  const encryptedContent = await encrypt(
    NWC_CONNECTION_SECRET,
    NWC_SERVICE_PUBKEY,
    JSON.stringify(content),
  );
  const eventTemplate = {
    kind: NWCWalletResponse,
    created_at: Math.round(Date.now() / 1000),
    content: encryptedContent,
    tags: [
      ["p", AUTHORIZED_PUBKEY],
      ["e", eventId],
    ],
  };

  return finalizeEvent(eventTemplate, NWC_CONNECTION_SECRET);
};

const extractAmountInSats = (invoice) => {
  return (
    lightBolt11Decoder
      .decode(invoice)
      .sections.find(({ name }) => name === "amount").value / 1000
  );
};

const handleNwcRequest = async (relay, event) => {
  let errorCode = null;
  let nwcRequest = null;

  try {
    nwcRequest = await decryptNwcRequestContent(event.content);

    if (nwcRequest.method !== supportedResultTypes.payInvoice) {
      errorCode = NOT_IMPLEMENTED;
    }
  } catch (err) {
    console.error(`error decrypting NWC request: ${err}`);
    errorCode = UNAUTHORIZED;
  }

  const invoice = nwcRequest?.params?.invoice;
  const amountInSats = extractAmountInSats(invoice);

  if (
    errorCode === null &&
    totalAmountSentInSats + amountInSats > TOTAL_MAX_SEND_AMOUNT_IN_SATS
  ) {
    errorCode = QUOTA_EXCEEDED;
  } else if (errorCode === null) {
    try {
      await payInvoice(invoice);
      totalAmountSentInSats = totalAmountSentInSats + amountInSats;
      console.log(`successfully paid ${amountInSats} sats`);
      console.log(
        `total amount of sats sent since this wallet service has been running: ${totalAmountSentInSats}\n\n`,
      );
    } catch (err) {
      console.error(`error making payment: ${err}`);
      errorCode = PAYMENT_FAILED;
    }
  }

  try {
    relay.publish(
      await makeNwcResponseEvent({
        eventId: event.id,
        requestMethod: nwcRequest?.method ?? "unknown",
        errorCode,
      }),
    );
  } catch (err) {
    console.error("failed to publish NWC response", err);
  }
};

start();
