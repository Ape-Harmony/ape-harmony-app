import type { NextPage } from "next";
import Head from "next/head";
import { BugAntIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import { FollowOnLens, Theme, Size, ShareToLens } from "@lens-protocol/widgets-react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ape Harmony - Home</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-5">
        <div className="px-5">
          <img src="\assets\ApeHarmony-Logo.png" alt="Image description" />
          <br></br>
          <div className="flex items-center flex-col flex-grow pt-5">
            <ShareToLens
              content="Check out this sick NFT Derivatives platform!!"
              url="https://apeharmony.com"
              hashtags="lens,web3,apeharmony,nfts,derivatives"
              via="Ape Harmony - NFTs Derivatives Platform"
              title="Share this site on Lens! 🌿"
              theme="blonde"
              size="medium"
            />
            <br></br>
            <FollowOnLens handle="psilocybin" theme="blonde" size="medium" title="Follow psilocybin.lens! 🌿" />
          </div>

          {/* <br />
          TODO: Bids sent
          <br />
          TODO: Approved position
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">scaffold-eth 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold">packages/nextjs/pages/index.tsx</code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract <code className="italic bg-base-300 text-base font-bold">YourContract.sol</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">packages/hardhat/contracts</code>
          </p> */}
        </div>

        {/* <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Borrow
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Lend
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;
