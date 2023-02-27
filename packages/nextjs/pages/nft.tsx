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
        TODO: NFT display: image, floor price. <br />
        Form: %, amount ETH <br />
        Current loans table: <br />
        1. 10 ETH for 10% of 100 ETH floor <br />
        ...
      </div>
    </>
  );
};

export default ExampleUI;
