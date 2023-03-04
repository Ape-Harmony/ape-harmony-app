import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import React from "react";
import { useRouter } from "next/router";
import { Slider, Switch, DatePicker } from "antd";
import moment from "moment";

export default function ContractInteraction(/*{ floorPrice }: { floorPrice: number }*/) {
  const [visible, setVisible] = useState(true);
  const [share, setShare] = useState(0);
  const [amount, setAmount] = useState("");
  const [equity, setEquity] = useState("");
  const [equitySlider, setEquitySlider] = useState("");
  const [loanAmount, setLoanAmount] = useState(0.005);
  const [dateTime, setDateTime] = useState(moment());

  const router = useRouter();
  const { tokenId, collectionName, floorPrice } = router.query;

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

  function handleChangeEquity(event) {
    const newValue = parseInt(event.target.value);

    if (newValue >= 1 && newValue <= 100) {
      setEquity(newValue);
      setEquitySlider(newValue);
    } else {
      setEquity(1);
      setEquitySlider(1);
    }
  }

  function handleChangeEquitySlider(event) {
    const newValue = parseInt(event);
    if (newValue >= 1 && newValue <= 100) {
      setEquity(newValue);
      setEquitySlider(newValue);
    }
    //handleChangeEquitySlider(newValue)
  }

  function handleChangeLoanAmount(event) {
    // const newValue = parseFixed(event.target.value).toFixed(2);
    // if (newValue) {
    //   setLoanAmount(newValue);
    // }
    setLoanAmount(event.target.value);
  }

  const handleDateTimeChange = value => {
    console.log(value);
    setDateTime(value);
  };

  return (
    <>
      <div className="form-control border mockup-window border-base-300 p-4">
        <label className="label">
          <span className="label-text">Floor Price</span>
        </label>
        <label className="input-group input-group-md">
          <input
            id="floorPrice"
            type="text"
            disabled={true}
            value={floorPrice}
            className="input input-bordered input-md"
          />
          <span>ETH</span>
        </label>
        <label className="label">
          <span className="label-text">Percentage of Equity (from 1 to 100%)</span>
        </label>
        <label className="input-group input-group-md justify-center">
          <input
            id="equity"
            type="number"
            min="1"
            max="100"
            placeholder="1-100"
            value={equity}
            className="input input-bordered input-md"
            onChange={handleChangeEquity}
          />
          <span>%</span>
        </label>
        <Slider
          id="equitySlider"
          // min="1"
          // max="100"
          tooltip={{ open: false }}
          defaultValue={100}
          disabled={false}
          value={equitySlider.toString()}
          onChange={handleChangeEquitySlider}
        />
        <label className="label">
          <span className="label-text">Loan amount</span>
        </label>
        <label className="input-group input-group-sm">
          <input
            id="loanAmount"
            type="text"
            placeholder="0.005"
            value={loanAmount}
            className="input input-bordered input-md"
            onChange={handleChangeLoanAmount}
          />
          <span>ETH</span>
        </label>
        <label className="label">
          <span className="label-text">Offer expiration</span>
        </label>
        <DatePicker showTime format="YYYY-MM-DD HH:mm" value={dateTime} onChange={handleDateTimeChange} />
        <label className="input-group input-group-sm">
          <span>Days</span>
        </label>
        <label className="label">
          <span className="label-text">Loan fee</span>
        </label>
        <label className="input-group input-group-sm">
          <input type="text" placeholder="username" className="input input-bordered input-sm" />
          <span>USDC</span>
        </label>
        <label className="label">
          <span className="label-text">30 Day late penalty</span>
        </label>
        <label className="input-group input-group-sm">
          <input type="text" placeholder="username" className="input input-bordered input-sm" />
          <span>APR</span>
        </label>
        <br></br>
        <button className="btn">Submit</button>
      </div>
    </>
  );
}
