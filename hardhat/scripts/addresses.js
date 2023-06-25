const { ethers } = require("hardhat");
const { getContractAddress } = require("@ethersproject/address");

async function main() {
    const [owner] = await ethers.getSigners();

    const transactionCount = await owner.getTransactionCount();

    const futureAddress = getContractAddress({
        from: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        nonce: 1,
    });

    console.log(futureAddress);
}

main();
