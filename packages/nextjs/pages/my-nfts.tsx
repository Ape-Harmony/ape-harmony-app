import { Network } from "alchemy-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import NftGallery from "~~/components/alchemy/NftGallery";
import MyNftsTable from "~~/components/alchemy/MyNftsTable";

import { ContractData, ContractInteraction } from "~~/components/ExampleUi";

const ExampleUI: NextPage = () => {
  const { address } = { address: "0x5635Ce931589c7F35bb85a1E6d8a46Aa0761A0B5" }; //useAccount();

  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
      </Head>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        TODO: NFTs with bids, order desc by offer value
        <br />
        TODO: NFTs I own, in vault, borrowed against at less than 100%, order desc by borrowed amount
        <br />
        TODO: NFTs in my wallet, order desc by maket value
      </div>
      {/* {address} */}
      <MyNftsTable walletAddress={address} chain={Network.ETH_MAINNET} />

      {/* <NftGallery walletAddress={address} chain={Network.ETH_MAINNET} /> */}
    </>
  );
};

export default ExampleUI;
