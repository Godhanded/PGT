const { ethers } = require("hardhat");

const networkConfig = {
    31337: {
        name: "localhost",
        fee: ethers.utils.parseEther("0.1"),
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
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    developmentChains,
    networkConfig,
};
