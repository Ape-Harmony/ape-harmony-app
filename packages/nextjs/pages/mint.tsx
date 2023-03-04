import { Network } from "alchemy-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import AllNftsTable from "~~/components/alchemy/AllNftsTable";
import { ContractData, ContractInteraction } from "~~/components/ExampleUi";
import NftMinter from "~~/components/alchemy/NftMinter";

const ExampleUI: NextPage = () => {
  // const { address } = useAccount();

  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
      </Head>
      <NftMinter
        tokenUri={""}
        imgSrc={"https://gateway.pinata.cloud/ipfs/Qma5JPiptf9BvR7JQnj97GtXpDLngL1BQ6wW337LvEHX5r"}
      />
    </>
  );
};

export default ExampleUI;
