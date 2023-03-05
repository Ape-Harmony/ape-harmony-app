import styles from "../../styles/NftMinter.module.css";
import { getNetwork, switchNetwork } from "@wagmi/core";
import { Contract } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function NFTMintingPage() {
  const tokenUri = "https://gateway.pinata.cloud/ipfs/QmeyKQVR9AFG75qUTDLmst8vzgvhZBdob2HLWRCarctDoM";
  const { isDisconnected, address } = useAccount();

  const {
    write: mintNFT,
    isLoading: isMinting,
    data: mintResult,
  } = useScaffoldContractWrite("SampleNft", "safeMint", [address, tokenUri]);

  // const [mintResult, setMintResult] = useState();

  // async function getMintResult() {
  //   const result = await mintData?.wait();
  //   setMintResult(result.);
  // }

  // useEffect(() => {
  //   getMintResult();
  // }, [mintData]);

  const { data: vaultContractData } = useDeployedContractInfo("Vault");

  async function deployNftContract() {
    const res = await fetch("/api/infura", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  const { writeAsync: depositNFT, data: depositResult } = useScaffoldContractWrite("Vault", "safeTransferFrom", [
    address,
    vaultContractData?.address,
    "",
  ]);

  const imgSrc = "https://gateway.pinata.cloud/ipfs/Qma5JPiptf9BvR7JQnj97GtXpDLngL1BQ6wW337LvEHX5r";

  return (
    <div className={styles.page_container}>
      <h1 className={styles.page_header}>Mint a CW3D NFT!</h1>

      <button className={styles.button} onClick={async () => await deployNftContract()}>
        Deploy NFT contract
      </button>

      <div className={styles.nft_image_container}>
        <img className={styles.nft_image} src={imgSrc} />
      </div>
      <div>
        <h1 className={styles.nft_title}>Mint a CW3D NFT!</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis iste assumenda et minima, nobis
          molestias? Dicta voluptatum laborum atque minus quis illo veniam a reiciendis aspernatur, eum ducimus voluptas
          consequuntur.
        </p>
      </div>
      {isDisconnected ? (
        <p>Connect your wallet to get started</p>
      ) : (
        <button
          className={`${styles.button} ${isMinting && `${styles.isMinting}`}`}
          disabled={isMinting}
          onClick={async () => await mintNFT()}
        >
          {isMinting ? "Minting" : "Mint NFT"}
        </button>
      )}

      {mintResult?.hash && (
        <div className={styles.transaction_box}>
          <p>See transaction on </p>
          <a className={styles.tx_hash} href={`https://mumbai.polygonscan.com/tx/${mintResult?.hash}`}>
            Mumbai Polygon Scan
          </a>
        </div>
      )}
    </div>
  );
}
