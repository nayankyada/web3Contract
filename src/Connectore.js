import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5],
});

const POLLING_INTERVAL = 25000;
export const walletconnect = new WalletConnectConnector({
 
  infuraId:"d5ffcd2812e4416d8d3fc5c43918286f",
  supportedChainIds:[1,4],
  bridge: "https://bridge.walletconnect.org",
  pollingInterval: POLLING_INTERVAL,
});
