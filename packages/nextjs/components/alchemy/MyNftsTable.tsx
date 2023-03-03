import styles from "../../styles/NftGallery.module.css";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Network } from "alchemy-sdk";

export default function MyNftsTable({
  walletAddress,
  collectionAddress,
  chain,
  pageSize,
}: {
  walletAddress?: string;
  collectionAddress?: string;
  chain?: Network;
  pageSize?: number;
}) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsloading] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  const [pageKey, setPageKey] = useState();
  const [excludeFilter, setExcludeFilter] = useState(true);
  const [values, setValues] = useState({});

  const handleDropdownChange = (event, rowId) => {
    const value = event.target.value;
    setValues(prevValues => ({
      ...prevValues,
      [rowId]: value,
    }));
  };

  const fetchNfts = () => {
    if (collectionAddress) {
      getNftsForCollection();
    } else if (walletAddress || address) {
      getNftsForOwner();
    }
  };

  const totalFloor = nfts && nfts.reduce((a, b) => a + (b.floor || 0), 0);

  const getNftsForOwner = async () => {
    setIsloading(true);
    if (isConnected || walletAddress) {
      try {
        const res = await fetch("/api/getNftsForOwner", {
          method: "POST",
          body: JSON.stringify({
            address: walletAddress ? walletAddress : address,
            pageSize: pageSize,
            chain: chain,
            pageKey: pageKey ? pageKey : null,
            excludeFilter: excludeFilter,
          }),
        }).then(res => res.json());
        console.log(res);

        setNfts(res.nfts);
        if (res.pageKey) setPageKey(res.pageKey);
      } catch (e) {
        console.log(e);
      }
    }

    setIsloading(false);
  };

  const getNftsForCollection = async () => {
    setIsloading(true);

    if (collectionAddress) {
      try {
        const res = await fetch("/api/getNftsForCollection", {
          method: "POST",
          body: JSON.stringify({
            address: collectionAddress ? collectionAddress : address,
            pageSize: pageSize,
            chain: chain,
            pageKey: pageKey ? pageKey : null,
            excludeFilter: excludeFilter,
          }),
        }).then(res => res.json());

        setNfts(res.nfts);
        if (res.pageKey) setPageKey(res.pageKey);
      } catch (e) {
        console.log(e);
      }
    }

    setIsloading(false);
  };

  useEffect(() => {
    fetchNfts();
  }, []);

  if (isDisconnected) return <p>Loading...</p>;
  return (
    <div className="">
      <div className="">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">My wallet's Total Value</div>
            <div className="stat-value">{totalFloor} ETH</div>
            <div className="stat-desc">Address: {walletAddress}</div>
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
      {pageKey && (
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
      )}
    </div>
  );
}

function NftCard({ nft }) {
  return (
    <div className={styles.card_container}>
      <div className={styles.image_container}>
        <img src={nft.media}></img>
      </div>
      <div className={styles.info_container}>
        <div className={styles.title_container}>
          <h3>{nft.title.length > 20 ? `${nft.title.substring(0, 15)}...` : nft.title}</h3>
          <p>Floor: {nft.floor}</p>
        </div>
        <hr className={styles.separator} />
        <div className={styles.symbol_contract_container}>
          <div className={styles.symbol_container}>
            <p>
              {nft.collectionName && nft.collectionName.length > 20
                ? `${nft.collectionName.substring(0, 20)}`
                : nft.collectionName}
            </p>

            {nft.verified == "verified" ? (
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                }
                width="20px"
                height="20px"
              />
            ) : null}
          </div>
          <div className={styles.contract_container}>
            {nft.contract.slice(0, 6)}...{nft.contract.slice(38)}
            {/* <img src={"https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"} width="15px" height="15px" /> */}
          </div>
        </div>

        <div className={styles.description_container}>{nft.description}</div>
      </div>
    </div>
  );
}
