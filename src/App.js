import React, { useEffect, useState, useCallback } from "react";
import "./style/index.css";
import "semantic-ui-css/semantic.min.css";
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "./Connectore";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import createContract from "./contract";
import { subscribe } from "graphql";
function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    connector,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
    library: web3,
  } = useWeb3React();
  const [balance, setBalance] = useState("");

  const login = useCallback(
    async (connector) => {
      if (connector) {
        await activate(connector, async (res, err) => {
          console.log(err, res);
        });
      }
    },
    [activate]
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    createContract(web3, "0xD26B70EF87dA3dd95758E757F085c2D4418D83c2")
      .methods.trade(account, 12)
      .send({
        from: account,
        gas: "3000000",
      })
      .once("sending", function (payload) {
        console.log("sending --- ", payload);
      })
      .once("sent", function (payload) {
        console.log("sent --- ", payload);
      })
      .once("transactionHash", function (hash) {
        console.log("transactionHash --- ", hash);
      })
      .once("receipt", function (receipt) {
        console.log("receipt --- ", receipt);
      })
      .once("confirmation", function (confirmationNumber, receipt) {
        console.log("confirmation --- ", confirmationNumber, receipt);
      })

      .once("error", function (error) {
        console.log("error --- ", error);
      })
      .then(function (receipt) {})
      .catch((er) => console.log(er));
  };

  useEffect(() => {
    if (chainId) {
      if (chainId !== 4) {
        setErrorMessage("Connect your wallet with rinkeby network first");
      } else {
        setErrorMessage("");
      }
    }
  }, [chainId]);

  useEffect(() => {
    web3?.eth
      .getBalance(account)
      .then((p) => {
        setBalance(web3?.utils.fromWei(p, "ether"));
        console.log(p);
      })
      .catch((e) => console.log(e));
  }, [account, chainId, active]);

  const connectWithRinkeby = async () => {
    if (connector instanceof WalletConnectConnector) {
      await web3.currentProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(4) }],
      });
    } else {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4" }],
      });
    }
  };
  const logout = async () => {
    if (connector instanceof WalletConnectConnector) {
      await connector.close();
      setErrorMessage("");
      // window.location.reload();
    } else {
      deactivate();
      setErrorMessage("");
      // window.location.reload();
    }
  };

  const subscribeEvent = async () => {
    // To filter events by indexed params from address
    createContract(
      web3,
      "0xD26B70EF87dA3dd95758E757F085c2D4418D83c2"
    ).events.NewTrade({ filter: { from: [account] } }, (err, res) => {
      if (!err) {
        console.log("NewTrade", res);
      }
    });
  };

  const unSubscribeEvent = async () => {
    web3.eth.clearSubscriptions();
  };
  return (
    <div className="App">
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Public Private Mint
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg ">
          {errorMessage && (
            <div className="rounded-md bg-red-50 mx-8 p-4  shadow-sm">
              <div className="flex justify-center">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-600">
                    {errorMessage}
                  </h3>
                  {account && (
                    <button
                      onClick={connectWithRinkeby}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Connect With Rinkeby
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {account && !errorMessage ? (
            <div className="px-4">
              <div className="px-4 py-5 my-4 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                <dt
                  className="text-md font-extrabold cursor-pointer text-gray-500 truncate"
                  onClick={() => {
                    navigator.clipboard.writeText(account);
                  }}
                >
                  <abbr title="Click To Copy">{account}</abbr>
                </dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {Number(balance).toFixed(4)} ETH
                </dd>
                <button
                  onClick={logout}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Disconnect Wallet
                </button>
              </div>
              <div className="bg-white py-4 px-4 mt-6 shadow sm:rounded-lg sm:px-10">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <button
                      onClick={submitHandler}
                      className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Mint Bored Mutant ape
                    </button>
                    <button
                      onClick={subscribeEvent}
                      className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Subscribe Event
                    </button>
                    <button
                      onClick={unSubscribeEvent}
                      className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      UnSubscribe Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !account ? (
            <div className="mx-8 flex space-x-3">
              <button
                onClick={() => {
                  login(injected);
                }}
                type="submit"
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect Metamask
              </button>
              <button
                onClick={() => {
                  login(walletconnect);
                }}
                type="submit"
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect WalletConnect
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
