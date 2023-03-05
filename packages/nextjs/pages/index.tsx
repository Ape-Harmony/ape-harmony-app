import type { NextPage } from "next";
import Head from "next/head";
import { BugAntIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/link";
import React from "react";
import { FollowOnLens, Theme, Size, ShareToLens } from "@lens-protocol/widgets-react";
import TwitterFollowButton from "~~/components/TwitterFollowButton";

const Home: NextPage = () => {
  const twitters = ["MychalSimka", "oscar_lbdr", "alexastrum"];

  return (
    <>
      <Head>
        <title>Ape Harmony - Home</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-5">
        <img src="\assets\ApeHarmony-Logo.png" alt="Ape harmony" />

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
              <code>installing...</code>
            </pre>
            <pre data-prefix=">" class="text-success">
              <code>Done!</code>
            </pre>
          </div>
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
          <div className="flex flex-row justify-between space-x-4">
            <div className="card card-bordered flex-grow border-white">
              <br></br>
              <figure>
                <img
                  src="https://pbs.twimg.com/profile_images/1631076910028689408/D2-sOWFl_400x400.jpg"
                  alt="Mychal"
                  width={200}
                  height={200}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">
                  Mychal Simka
                  <div class="badge mx-2 badge-secondary">NEW</div>
                </h2>
                Business hacker <br></br> 11 Animated Films produced @ Lionsgate
                <div class="justify-end card-actions">
                  <TwitterFollowButton username={twitters[0]} />
                </div>
              </div>
            </div>
            <div className="card card-bordered flex-grow border-white">
              <br></br>

              <figure>
                <img
                  src="https://pbs.twimg.com/profile_images/1610978532112359424/Cu99eVtZ_400x400.jpg"
                  alt="Oscar"
                  width={200}
                  height={200}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">
                  Oscar Leal
                  <div class="badge mx-2 badge-secondary">NEW</div>
                </h2>
                Software Engineer / Data Scientist <br></br>MS Business Analytics React, Python
                <div class="justify-end card-actions">
                  <FollowOnLens handle="psilocybin" theme="blonde" size="medium" title="Follow psilocybin.lens! 🌿" />

                  <TwitterFollowButton username={twitters[1]} />
                </div>
              </div>
            </div>
            <div className="card card-bordered flex-grow border-white">
              <br></br>

              <figure>
                <img
                  src="https://i.seadn.io/gae/kwkMZKnTyrqRZwMZsbOlltgqcQ-09fjXca4nAfaSoHl9nAqIdv4NtR1rQeKz9CsZhoqtwq-bvOs_DF9JammcqJj0a_mCvh575JlZba0?auto=format&w=1000"
                  alt="My image"
                  width={200}
                  height={200}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">
                  Alex Lungu
                  <div class="badge mx-2 badge-secondary">NEW</div>
                </h2>
                Software Engineer and Dev Relations<br></br> @ Google Firebase, Adobe, CS, Identity Services
                <div class="justify-end card-actions">
                  <TwitterFollowButton username={twitters[2]} />
                </div>
              </div>
            </div>
            <div className="card card-bordered flex-grow border-white">
              <br></br>

              <figure>
                <img
                  src="https://media.licdn.com/dms/image/D4E03AQEFSNvvAQr8bw/profile-displayphoto-shrink_800_800/0/1677779166024?e=2147483647&v=beta&t=7iXtKmCNJlVu1ar_EYJKvQwVXnnuwFx58TIQx-T-egg"
                  alt="My image"
                  width={200}
                  height={200}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">
                  Tim Clancy
                  <div class="badge mx-2 badge-secondary">NEW</div>
                </h2>
                Tech Lead @ Elliotrades<br></br>Architect @ Gigamart Solidity, Huff
                <div class="justify-end card-actions"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
