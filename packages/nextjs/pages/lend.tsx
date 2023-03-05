import { Network } from "alchemy-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import AllNftsTable from "~~/components/alchemy/AllNftsTable";
import MyNftsTable from "~~/components/alchemy/MyNftsTable";
import MyNftsTable2 from "~~/components/alchemy/MyNftsTable2";
import { ContractData, ContractInteraction } from "~~/components/ExampleUi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const ExampleUI: NextPage = () => {
  const { address } = { address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" }; //useAccount();
  const { data: vaultContractData } = useDeployedContractInfo("Vault");

  return (
    <>
      <Head>
        <title>Ape Harmony - All market</title>
      </Head>

      {/* <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        TODO: NFTs with my own bids
        <br />
        TODO: NFTs with offers, order desc by offer value
        <br />
        TODO: NFTs borrowed against at less than 100%, order desc by available amount
        <br />
        TODO: NFTs in other user wallets, order desc by maket value
      </div> */}

      {vaultContractData && <MyNftsTable2 walletAddress={[vaultContractData.address]} />}
      <AllNftsTable collectionAddress={address} chain={Network.ETH_MAINNET} />
    </>
  );
};

export default ExampleUI;
