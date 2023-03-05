import { FollowOnLens } from "@lens-protocol/widgets-react";
import type { NextPage } from "next";
import Head from "next/head";
import { ContractData, ContractInteraction } from "~~/components/ExampleUi";
import TwitterFollowButton from "~~/components/TwitterFollowButton";

const ExampleUI: NextPage = () => {
  const twitters = ["MychalSimka", "oscar_lbdr", "alexastrum"];

  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <div className="flex flex-col items-center pt-10 text-2xl mx-5">Team</div>
      <br></br>
      <br></br>
      <div className="flex flex-row justify-between space-x-4 px-5">
        <div className="card card-bordered flex-grow border-white">
          <br></br>
          <figure>
            <img
              src="https://pbs.twimg.com/profile_images/1631076910028689408/D2-sOWFl_400x400.jpg"
              alt="11_eleven"
              width={200}
              height={200}
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">11_eleven</h2>
            Business hacker
            <div class="justify-end card-actions">
              <TwitterFollowButton username={twitters[0]} />
            </div>
          </div>
        </div>
        <div className="card card-bordered flex-grow border-white">
          <br></br>

          <figure>
            <img
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjFmODg1ZDA5MjFlYzU5ZjZhZDI1ZjlkMzM2ZTkwNzEwNDU5Mzg0NCZjdD1n/VP3vLDstzoq6KewMIX/giphy.gif"
              alt="0xscar"
              width={200}
              height={200}
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">Oscar</h2>
            degen dev
            <div class="justify-end card-actions">
              <TwitterFollowButton username={twitters[1]} />
            </div>
            <div class="justify-end card-actions">
              <FollowOnLens handle="psilocybin" theme="blonde" size="medium" title="Follow psilocybin.lens! 🌿" />
            </div>
          </div>
        </div>
        <div className="card card-bordered flex-grow border-white">
          <br></br>
          <figure>
            <img
              src="https://i.seadn.io/gae/kwkMZKnTyrqRZwMZsbOlltgqcQ-09fjXca4nAfaSoHl9nAqIdv4NtR1rQeKz9CsZhoqtwq-bvOs_DF9JammcqJj0a_mCvh575JlZba0?auto=format&w=1000"
              alt="Alex"
              width={200}
              height={200}
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">Alex</h2>
            Stack underflow producer
            <div class="justify-end card-actions">
              <TwitterFollowButton username={twitters[2]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExampleUI;
