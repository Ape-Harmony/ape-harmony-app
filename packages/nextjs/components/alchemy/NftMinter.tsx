import styles from "../../styles/NftMinter.module.css";
import { getNetwork, switchNetwork } from "@wagmi/core";
import { Contract } from "alchemy-sdk";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function NFTMintingPage({
  //   contractAddress,
  tokenUri,
  abi,
  imgSrc,
}: {
  //   contractAddress: string;
  tokenUri: string;
  abi: string;
  imgSrc: string;
}) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [txHash, setTxHash] = useState();
  const [isMinting, setIsMinting] = useState(false);

  const { isDisconnected } = useAccount();
  const { writeAsync, isLoading } = useScaffoldContractWrite("SampleNft", "safeMint", [address, tokenUri]);

  const mintNFT = async () => {
    const { chain } = getNetwork();
    if (chain?.id != 80001) {
      try {
        await switchNetwork({
          chainId: 80001,
        });
      } catch (e) {
        return;
      }
    }
    if (signer) {
      await fetch("/api/getNftsForOwner", {});

      // const nftContract = new Contract(contractAddress, abi, signer);
      //   try {
      writeAsync();
      // const mintTx = await nftContract.safeMint(address, tokenUri);
      // setTxHash(mintTx?.hash);
      // setIsMinting(true);
      // await mintTx.wait();
      // setIsMinting(false);
      // setTxHash(undefined);
      //   } catch (e) {
      //     console.log(e);
      //     setIsMinting(false);
      //   }
    }
  };

  return (
    <div className={styles.page_container}>
      <h1 className={styles.page_header}>Mint a CW3D NFT!</h1>

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

      {txHash && (
        <div className={styles.transaction_box}>
          <p>See transaction on </p>
          <a className={styles.tx_hash} href={`https://mumbai.polygonscan.com/tx/${txHash}`}>
            Mumbai Polygon Scan
          </a>
        </div>
      )}
    </div>
  );
}
