import type { NextPage } from "next";
import Head from "next/head";
import { ContractData, ContractInteraction } from "~~/components/ExampleUi";

const ExampleUI: NextPage = () => {
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
    </>
  );
};

export default ExampleUI;
