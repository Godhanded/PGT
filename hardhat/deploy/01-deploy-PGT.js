const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccouns, deployments }) => {
    const { deployer } = await getNamedAccouns();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId;

    const netArgs = networkConfig[chainId];

    const args = [netArgs.fee];

    log("------------------------------------------");

    const PGT = await deploy("PriceGapToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 2,
    });

    log("-------------------------------");
    if (!developmentChains.includes(network.name) && process.env.BSCSCAN_API) {
        await verify(PGT.address, args);
    }

    log("-------------------------------------------------------");
};

module.exports.tags = ["PGT", "main", "all"];
