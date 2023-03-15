import type { NextPage } from "next";
import Head from "next/head";
import { BugAntIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/link";
import React from "react";
import { FollowOnLens, Theme, Size, ShareToLens } from "@lens-protocol/widgets-react";
import TwitterFollowButton from "~~/components/TwitterFollowButton";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ape Harmony - Home</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-8">
        <img src="\assets\ApeHarmony-Logo.png" alt="Ape harmony" />
        <br></br>
        <div className="px-5 justify-center">
          <br></br>
          <div class="mockup-code bg-primary max-w-4xl mx-auto">
            <pre data-prefix="$">
              <code class="text-white">a new platform that allows users to buy/sell non-fungible tokens,</code>
            </pre>
            <pre data-prefix="$">
              <code class="text-white">repay loans against them (NFTs),</code>
            </pre>
            <pre data-prefix="$">
              <code class="text-white">as well as trade the NFTs themselves.</code>
            </pre>
            <pre data-prefix="$"></pre>
            <pre data-prefix="$">
              <code class="text-white">NFT owners can monetize their assets without selling them,</code>
            </pre>
            <pre data-prefix="$">
              <code class="text-white">and lenders can invest in high-value NFT assets</code>
            </pre>
            <pre data-prefix="$">
              <code class="text-white">without having to purchase the full amount.</code>
            </pre>
            <pre data-prefix="$">
              <code class="text-white">
                Loans on this platform do not accrue interest and do not expire at a specific time
              </code>
            </pre>
            <pre data-prefix="$">
              <code class="text-white">reducing the risk of auto-liquidation.</code>
            </pre>
            <pre data-prefix="$"></pre>

            <pre data-prefix=">" class="text-warning">
              <code>Metis demo</code>
            </pre>
            {/* <pre data-prefix=">" class="text-success">
              <code>Done!</code>
            </pre> */}
          </div>
          <br></br>
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
          </div>
          <br></br>
        </div>
      </div>
    </>
  );
};

export default Home;
