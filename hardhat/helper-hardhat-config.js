const { ethers } = require("hardhat");

const networkConfig = {
    31337: {
        name: "localhost",
        fee: ethers.utils.parseUnits("0.1", 6),
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
        fee: ethers.utils.parseUnits("0.1", 6),
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    developmentChains,
    networkConfig,
};
