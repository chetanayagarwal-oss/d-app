import hre from "hardhat";

async function main() {
  console.log("Deploying SentinelPay contract...");

  const SentinelPay = await hre.ethers.getContractFactory("SentinelPay");
  const sentinelPay = await SentinelPay.deploy();

  await sentinelPay.waitForDeployment();

  const target = await sentinelPay.getAddress();
  console.log(`SentinelPay deployed to: ${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
