const hre = require('hardhat');

async function main() {
  const RealEstateToken = await hre.ethers.getContractFactory(
    'RealEstateToken'
  );
  const realEstateToken = await RealEstateToken.deploy();

  await realEstateToken.deployed();
  console.log('RealEstateToken deployed to:', realEstateToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
