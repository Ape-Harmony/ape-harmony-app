import { Network } from "alchemy-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import NftGallery from "~~/components/alchemy/NftGallery";
import MyNftsTable from "~~/components/alchemy/MyNftsTable";

import { ContractData, ContractInteraction } from "~~/components/ExampleUi";

const ExampleUI: NextPage = () => {
  const { address } = { address: "0xCe90a7949bb78892F159F428D0dC23a8E3584d75" }; //useAccount();

  return (
    <>
      <Head>
        <title>Ape Harmony - My NFTs</title>
      </Head>
      {/* <div className="grid lg:grid-cols-2 flex-grow" display={true} data-theme="exampleUi">
        TODO: NFTs with bids, order desc by offer value
        <br />
        TODO: NFTs I own, in vault, borrowed against at less than 100%, order desc by borrowed amount
        <br />
        TODO: NFTs in my wallet, order desc by maket value
      </div> */}
      {/* {address} */}
      <br></br>
      <div className="md-16">
        <MyNftsTable walletAddress={address} chain={Network.ETH_MAINNET} />
      </div>

      {/* <NftGallery walletAddress={address} chain={Network.ETH_MAINNET} /> */}
    </>
  );
};

export default ExampleUI;
