import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useSigner } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export default function MyNftsTable2({ walletAddress }: { walletAddress?: string[] }) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsloading] = useState(false);
  const { isDisconnected, address } = useAccount();
  const chain = useChainId();
  const [values, setValues] = useState({});
  const { data: vaultContractData } = useDeployedContractInfo("Vault");
  const { data: signer } = useSigner();

  const handleDropdownChange = (event, rowId) => {
    const value = event.target.value;
    setValues(prevValues => ({
      ...prevValues,
      [rowId]: value,
    }));
  };

  const totalFloor = nfts && nfts.reduce((a, b) => a + (b.floor || 0), 0).toFixed(3);

  const getCreditScoreFromWallet = async () => {
    setIsloading(true);

    try {
      const res = await fetch("/api/getCreditScoreFromWallet", {
        method: "POST",
      }).then(res => res.json());
    } catch (e) {
      console.log(e);
    }

    setIsloading(false);
  };

  const getNftsForOwner = async () => {
    setIsloading(true);
    if (walletAddress) {
      try {
        const res = await fetch("/api/getNftsForOwner", {
          method: "POST",
          body: JSON.stringify({
            addresses: walletAddress,
            chain: chain,
          }),
        }).then(res => res.json());
        // console.log(res);
        setNfts(res.nfts);
        // if (res.pageKey) setPageKey(res.pageKey);
      } catch (e) {
        console.log(e);
      }
    }

    setIsloading(false);
  };

  useEffect(() => {
    getCreditScoreFromWallet();
  }, []);

  useEffect(() => {
    getNftsForOwner();
  }, [walletAddress]);

  async function makeOffer() {}

  if (isDisconnected) return <p>Loading...</p>;
  return (
    <div className="">
      <div className="">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">My wallet's total value</div>
            <div className="stat-value">{totalFloor} ETH</div>
            {/* <div className="stat-desc">Address: {walletAddress}</div> */}
          </div>
        </div>
        <div>
          <table className="table w-full">
            <thead>
              {/* <tr>
                <th colSpan="6"></th>
                <th colSpan="6">Request Loan</th>
              </tr> */}
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
                      <td>
                        <select
                          value={values[nft.tokenId] || ""}
                          onChange={event => handleDropdownChange(event, nft.tokenId)}
                          tabIndex="0"
                          class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-32"
                        >
                          <option value="option2">3 ETH / 10%</option>
                          <option value="option3">4 ETH / 20%</option>
                          <option value="option1">2 ETH / 10%</option>
                        </select>
                      </td>
                      <td>X ETH</td>
                      <td>Y%</td>
                      <td>24 hrs</td>
                      <td>1 USDC</td>
                      <td>30 USDC + 0.3 ETH</td>
                      <td>
                        <Link href={{ pathname: "/form-offer" }}>
                          <button className="btn">Make offer</button>
                        </Link>
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
      {/* {pageKey && (
        <div className={styles.button_container}>
          <a
            className={styles.button_black}
            onClick={() => {
              fetchNfts(pageKey);
            }}
          >
            Load more
          </a>
        </div>
      )} */}
    </div>
  );
}
