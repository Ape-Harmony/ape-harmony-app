import styles from "../../styles/NftGallery.module.css";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { Network } from "alchemy-sdk";

export default function MyNftsTable({ walletAddress }: { walletAddress?: string[] }) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsloading] = useState(false);
  const { isDisconnected } = useAccount();
  const chain = useChainId();
  const [pageKey, setPageKey] = useState();
  const [values, setValues] = useState({});

  const handleDropdownChange = (event, rowId) => {
    const value = event.target.value;
    setValues(prevValues => ({
      ...prevValues,
      [rowId]: value,
    }));
  };

  const totalFloor = nfts && nfts.reduce((a, b) => a + (b.floor || 0), 0).toFixed(3);

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
        console.log(res);

        setNfts(res.nfts);
        // if (res.pageKey) setPageKey(res.pageKey);
      } catch (e) {
        console.log(e);
      }
    }

    setIsloading(false);
  };

  useEffect(() => {
    getNftsForOwner();
  }, [walletAddress]);

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
              <tr>
                <th colSpan="6"></th>
                <th colSpan="6">Request Loan</th>
              </tr>
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
                          <option value="">Select offer</option>
                          <option value="option1">X ETH / X%</option>
                          <option value="option2">3 ETH / 10%</option>
                          <option value="option3">4 ETH / 20%</option>
                        </select>
                      </td>
                      <td>x ETH</td>
                      <td>x% </td>
                      <td>24 hrs</td>
                      <td>x USDC</td>
                      <td>x*30 + 0.1x USDC</td>
                      <td>
                        <button className="btn">Submit</button>
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
