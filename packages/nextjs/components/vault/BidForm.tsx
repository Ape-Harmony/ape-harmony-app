import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { Slider } from "../components/Slider";
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

  return <>
  <div className="form-control">
  <Slider value={sliderValue} onChange={handleSliderChange} />
  % of the NFT
  <label className="label">
    <span className="label-text">vertical</span>
  </label> 
  <label className="input-group">
    <span>Email</span> 
    <input type="text" placeholder="info@site.com" className="input input-bordered">
  </label>
</div> 
<div className="form-control">
  <label className="label">
    <span className="label-text">medium</span>
  </label> 
  <label className="input-group input-group-md">
    <input type="text" value="0.099" className="input input-bordered input-md"> 
    <span>BTC</span>
  </label>
</div> 
<div className="form-control">
  <label className="label">
    <span className="label-text">small</span>
  </label> 
  <label className="input-group input-group-sm">
    <span>Price</span> 
    <input type="text" value="20.99" className="input input-bordered input-sm"> 
    <span>USD</span>
  </label>
</div> 
<div className="form-control">
  <label className="label">
    <span className="label-text">tiny</span>
  </label> 
  <label className="input-group input-group-xs">
    <span>@</span> 
    <input type="text" placeholder="username" className="input input-bordered input-xs">
  </label>
</div>

FORM field: ETH amont, % of the NFT</>;
}
