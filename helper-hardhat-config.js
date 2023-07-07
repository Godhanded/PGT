const { ethers } = require("hardhat");

const networkConfig = {
    31337: {
        name: "localhost",
        fee: ethers.utils.parseEther("0.1"),
        pancakeSwap: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        usdt: "0x55d398326f99059fF775485246999027B3197955",
        amountA: ethers.utils.parseEther("16719"),
        amountB: ethers.utils.parseEther("3000"),
    },
    5: {
        name: "goerli",
        fee: "",
    },
    97: {
        name: "BSCTest",
        fee: "",
    },
    56: {
        name: "BSC",
        fee: ethers.utils.parseEther("0.1"),
        lpAddr: "0xaCFe55620451089c49C1F2635CE10F141cBeb7eB",
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    developmentChains,
    networkConfig,
};
