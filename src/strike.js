const axios = require("axios");
const { STRIKE_API_KEY, STRIKE_SOURCE_CURRENCY } = require("./constants");

const createStrikePaymentQuote = async (invoice) => {
  const { data } = await axios({
    method: "post",
    url: "https://api.strike.me/v1/payment-quotes/lightning",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${STRIKE_API_KEY}`,
    },
    data: JSON.stringify({
      lnInvoice: invoice,
      sourceCurrency: STRIKE_SOURCE_CURRENCY,
    }),
  });

  return data.paymentQuoteId;
};

const executeStrikePaymentQuote = async (paymentQuoteId) => {
  const { data } = await axios({
    method: "patch",
    url: `https://api.strike.me/v1/payment-quotes/${paymentQuoteId}/execute`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${STRIKE_API_KEY}`,
    },
  });

  return data;
};

const payInvoice = async (invoice) => {
  const strikePaymentQuoteId = await createStrikePaymentQuote(invoice);

  return executeStrikePaymentQuote(strikePaymentQuoteId);
};

module.exports = { payInvoice };
