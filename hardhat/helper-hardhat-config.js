const { ethers } = require("hardhat");

const networkConfig = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
    97: {
        name: "BSCTest",
    },
    56: {
        name: "BSC",
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    developmentChains,
    networkConfig,
};
