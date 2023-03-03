import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import React from "react";

export default function ContractInteraction({ floorPrice }: { floorPrice: number }) {
  const [sliderValue, setSliderValue] = useState(50);
  const [visible, setVisible] = useState(true);
  const [share, setShare] = useState(0);
  const [amount, setAmount] = useState("");

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };
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

  return (
    <>
      <div className="form-control border mockup-window border-base-300 p-4">
        <label className="label">
          <span className="label-text">Floor Price</span>
        </label>
        <label className="input-group input-group-md">
          <input type="text" placeholder="0.099" className="input input-bordered input-md" />
          <span>ETH</span>
        </label>
        <label className="label">
          <span className="label-text">Shares from 1 to 100</span>
        </label>
        <label className="input-group">
          <span>No. of shares</span>
          <input type="text" placeholder="1-100" className="input input-bordered" />
        </label>
        <label className="label">
          <span className="label-text">Price</span>
        </label>
        <label className="input-group input-group-md">
          <input type="text" placeholder="0.099" className="input input-bordered input-md" />
          <span>ETH</span>
        </label>
        <label className="label">
          <span className="label-text">Offer expiration</span>
        </label>
        <label className="input-group input-group-sm">
          <input type="text" placeholder="20.99" className="input input-bordered input-sm" />
          <span>Day</span>
        </label>
        <label className="label">
          <span className="label-text">Interest rate</span>
        </label>
        <label className="input-group input-group-sm">
          <input type="text" placeholder="username" className="input input-bordered input-sm" />
          <span>%</span>
        </label>
        <label className="label">
          <span className="label-text">Daily compound interest</span>
        </label>
        <label className="input-group input-group-sm">
          <input type="text" placeholder="username" className="input input-bordered input-sm" />
          <span>%</span>
        </label>
      </div>
    </>
  );
}
