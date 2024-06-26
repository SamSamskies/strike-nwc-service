# strike-nwc-service
Nostr Wallet Connect service using Strike API.

##  Supported NWC Commands

`pay_invoice` - requires `partner.payment-quote.lightning.create` and `partner.payment-quote.execute` Strike API scopes.

`make_invoice` -  requires `partner.invoice.create` and `partner.invoice.quote.generate` Strike API scopes.

`lookup_invoice` -  requires `partner.invoice.read` Strike API scope.

## Helper Scripts

`npm run generate-secret` will randomly generate a 32 byte hex encoded string which you can use to create your `NWC_SERVICE_PRIVKEY` and `NWC_CONNECTION_SECRET` env vars.

`npm run print-nwc` will print out your NWC connection string that you can use in Nostr clients such as Damus to make payments.

## Usage

1. Create an account with Strike if you don't already have one https://strike.me/download/
1. Get a Strike API key from https://dashboard.strike.me/
1. Install the dependencies using npm or yarn or whatever your heart desires
1. Create a .env file with all the required env variables (see .env.example)
1. Make sure you have money in your Strike account
1. Print your NWC connection by running `npm run print-nwc` and copy it into whatever Nostr client you'd like to use to make payments
1. Run the server `npm start`. If you have [pm2](https://pm2.keymetrics.io/) installed, start the server by running `pm2 start src/index.js` instead of `npm start`.

Make sure the server is running whenever making payments.
