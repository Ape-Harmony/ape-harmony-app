import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { LienNft, SampleNft, VaultReceiptNft } from "../typechain-types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const sampleNft = await deploy("SampleNft", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [],
  //   log: true,
  //   // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
  //   // automatically mining the contract deployment transaction. There is no effect on live networks.
  //   autoMine: true,
  //   skipIfAlreadyDeployed: false,
  // });

  // const lienNft = await deploy("LienNft", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [],
  //   log: true,
  //   // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
  //   // automatically mining the contract deployment transaction. There is no effect on live networks.
  //   autoMine: true,
  //   skipIfAlreadyDeployed: false,
  // });

  // const receiptMinter = await deploy("VaultReceiptNft", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [],
  //   log: true,
  //   // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
  //   // automatically mining the contract deployment transaction. There is no effect on live networks.
  //   autoMine: true,
  //   skipIfAlreadyDeployed: false,
  // });

  const vault = await deploy("Vault", {
    from: deployer,
    // Contract constructor arguments
    args: [
      "0x0000000000000000000000000000000000000000", // oracle
      "0xE5172B5Fad48CB457C2A4bE2793d05C1d055970a", // receiptMinter.address,
      "0x50d0F098DA4089B72F41C5Af116EDb4064503CF3", // lienNft.address,
      "0x0000000000000000000000000000000000000000", // collection
      "0",
      "https://gateway.pinata.cloud/ipfs/QmeyKQVR9AFG75qUTDLmst8vzgvhZBdob2HLWRCarctDoM",
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });
  // console.log("Vault address: ", vault.address);

  // const lienNftContract = await hre.ethers.getContract<LienNft>("LienNft", deployer);
  // try {
  //   if (vault.address !== (await lienNftContract.owner())) {
  //     console.log(await lienNftContract.transferOwnership(vault.address));
  //   }
  // } catch (e) {
  //   console.warn(e);
  // }

  // const vaultReceiptNft = await hre.ethers.getContract<VaultReceiptNft>("VaultReceiptNft", deployer);
  // try {
  //   if (vault.address !== (await vaultReceiptNft.owner())) {
  //     console.log(await vaultReceiptNft.transferOwnership(vault.address));
  //   }
  // } catch (e) {
  //   console.warn(e);
  // }

  // await deploy("Deployer", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: ["0x8c0c1Ab74Ddb3fa8c7827262b98766D07D2ada9D"],
  //   log: true,
  //   // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
  //   // automatically mining the contract deployment transaction. There is no effect on live networks.
  //   autoMine: true,
  //   skipIfAlreadyDeployed: false,
  // });

  // const sampleNftMinter = await hre.ethers.getContract<SampleNft>("SampleNft", deployer);
  // console.log("mint", await sampleNftMinter.safeMint(vault.address, "https://gateway.pinata.cloud/ipfs/QmeyKQVR9AFG75qUTDLmst8vzgvhZBdob2HLWRCarctDoM"));
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
