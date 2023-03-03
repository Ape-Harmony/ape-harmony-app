import type { NextPage } from "next";
import Head from "next/head";
import { ContractData, ContractInteraction } from "~~/components/ExampleUi";
import BidForm from "~~/components/vault/BidForm";

const ExampleUI: NextPage = () => {
  return (
    <>
      <Head>
        <title>Make Offer Form</title>
      </Head>
      <div className="grid flex-grow">
        <div className="flex justify-center">
          <BidForm floorPrice={4}></BidForm>
        </div>
      </div>
    </>
  );
};

export default ExampleUI;
