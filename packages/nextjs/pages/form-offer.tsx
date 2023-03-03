import type { NextPage } from "next";
import Head from "next/head";
import { ContractData, ContractInteraction } from "~~/components/ExampleUi";

const ExampleUI: NextPage = () => {
  return (
    <>
      <Head>
        <title>Make Offer Form</title>
      </Head>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi"></div>
    </>
  );
};

export default ExampleUI;
