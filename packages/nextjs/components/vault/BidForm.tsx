import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function ContractInteraction({ floorPrice }: { floorPrice: number }) {
  const [visible, setVisible] = useState(true);
  const [share, setShare] = useState(0);
  const [amount, setAmount] = useState("");

  const deadline = new Date(Date.now() + 1000 * 60 * 60); // 1h from now
  const offerDeadline = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1d from now
  const signature = "TODO Oracle floor price";

  const { writeAsync, isLoading } = useScaffoldContractWrite(
    "Vault",
    "proposeLoan",
    [share * 100 * 100, offerDeadline, floorPrice, deadline, signature],
    amount,
  );

  function submitForm() {
    writeAsync();
  }

  return <>FORM field: ETH amont, % of the NFT</>;
}
