import type { NextPage } from "next";
import Head from "next/head";
import { useAccount } from "wagmi";
import MyNftsTable3 from "~~/components/MyNftsTable3";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ExampleUI: NextPage = () => {
  const { address } = useAccount();

  const {
    write: mintNFT,
    isLoading: isMinting,
    data: mintResult,
  } = useScaffoldContractWrite(
    "SampleNft",
    "safeMint",
    [address, "https://gateway.pinata.cloud/ipfs/QmeyKQVR9AFG75qUTDLmst8vzgvhZBdob2HLWRCarctDoM"],
    "0",
  );

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
      <div className="md-16">{address && <MyNftsTable3 walletAddress={[address]} />}</div>
      <div>
        <button className="btn" onClick={mintNFT}>
          Mint sample NFT
        </button>
      </div>
    </>
  );
};

export default ExampleUI;
