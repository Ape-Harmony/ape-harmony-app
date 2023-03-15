import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useSigner } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function MyNftsTable3({ walletAddress }: { walletAddress: string[] }) {
  const { data: vaultContractData } = useDeployedContractInfo("Vault");

  const { data: tokenId } = useScaffoldContractRead("SampleNft", "tokenOfOwnerByIndex", {
    args: [walletAddress[0], "0"],
  });
  const { data: collectionName } = useScaffoldContractRead("SampleNft", "name");

  const isLoading = !(collectionName && tokenId);
  const nfts = isLoading ? [] : [{ tokenId: tokenId.toString(), collectionName, floor: 1 }];

  const totalFloor = nfts ? nfts.reduce((a, b) => a + (b.floor || 0), 0).toFixed(3) : 0;

  const { write: deposit } = useScaffoldContractWrite(
    "SampleNft",
    "safeTransferFrom",
    [walletAddress[0], vaultContractData && vaultContractData.address, tokenId],
    "0",
  );

  console.log(nfts);

  return (
    <div className="">
      <div className="">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">My wallet's total value</div>
            <div className="stat-value">{totalFloor} ETH</div>
          </div>
        </div>
        <div>
          <table className="table w-full">
            <thead>
              <tr>
                <th>image</th>
                <th>collection name</th>
                <th>floor</th>
                <th>token id</th>
                <th>% owned</th>
                <th>best offer</th>
                <th>amount</th>
                <th>% offer</th>
                <th>expiration</th>
                <th>daily fee</th>
                <th>late penalty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <p>Loading...</p>
              ) : nfts?.length ? (
                nfts.map(nft => {
                  return (
                    <tr className="hover" key={nft.tokenId}>
                      <td>
                        <img width="50" height="50" src={nft.media}></img>
                      </td>
                      <td>
                        {nft.collectionName.length > 20 ? `${nft.collectionName.slice(0, 20)}...` : nft.collectionName}
                      </td>
                      <td>{nft.floor} ETH</td>
                      <td>{nft.tokenId.length > 6 ? `${nft.tokenId.slice(0, 6)}...` : nft.tokenId}</td>
                      <td>x%</td>
                      <td></td>
                      <td>X ETH</td>
                      <td>Y%</td>
                      <td>24 hrs</td>
                      <td>1 USDC</td>
                      <td>30 USDC + 0.3 ETH</td>
                      <td>
                        <button className="btn" onClick={deposit}>
                          Deposit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <p>No NFTs found for the selected address</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
