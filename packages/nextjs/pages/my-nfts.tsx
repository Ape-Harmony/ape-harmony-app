import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import MyNftsTable from "~~/components/alchemy/MyNftsTable";

const ExampleUI: NextPage = () => {
  const { address } = useAccount();

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

      <br></br>
      <div className="md-16">{address && <MyNftsTable walletAddress={[address]} />}</div>
    </>
  );
};

export default ExampleUI;
