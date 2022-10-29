// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 

  const [owner1,owner2,owner3,recipient1] = await hre.ethers.getSigners();
  const threshold=2;

  const MultiSignerWallet = await hre.ethers.getContractFactory("MultiSignerWallet");
  const wallet = await MultiSignerWallet.deploy([owner1.address,owner2.address,owner3.address],threshold);

  await wallet.deployed();
  const contractBalance1=await hre.ethers.provider.getBalance(wallet.address);

  console.log(
    `wallet deployed to ${wallet.address}`
  );
  await wallet.deposit({value:2})

  const contractBalance2=await hre.ethers.provider.getBalance(wallet.address);
  console.log(contractBalance1,contractBalance2);

  const owners=await wallet.getOwners();

 const transfer=await wallet.createTransfer(1,recipient1.address);
 await transfer.wait();
 const transfers=await wallet.getTransfers();


 const approver1=await wallet.connect(owner1).approveTransfer(0)
 await approver1.wait()
 const receiverBalance1=await hre.ethers.provider.getBalance(recipient1.address);


 const approver2=await wallet.connect(owner2).approveTransfer(0)
 await approver2.wait()
 const receiverBalance2=await hre.ethers.provider.getBalance(recipient1.address);

 

 const transfers2=await wallet.getTransfers();

 
console.log("wallet deployed to:",receiverBalance1,receiverBalance2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
