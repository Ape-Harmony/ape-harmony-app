import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";

export default function LockButton({ collection }: { walletAddress?: string[] }) {
  const [nfts, setNfts] = useState();
  const [isLoading, setIsloading] = useState(false);
  const { isDisconnected } = useAccount();
  const chain = useChainId();
  const [values, setValues] = useState({});

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

  function lockInVault(collection: string, tokenId: string) {
    console.log("lockInVault", collection, tokenId);
  }

  return (
    <button className="btn" onClick={() => lockInVault(nft.contract, nft.tokenId)}>
      Lock in Vault
    </button>
  );
}
