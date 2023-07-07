const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId;

    const netArgs = networkConfig[chainId];

    args = [netArgs.lpAddr];

    log("------------------------------------------");
    const lpLock = await deploy("LpLock", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 2,
    });

    log("-------------------------------");
    if (!developmentChains.includes(network.name) && process.env.BSCSCAN_API) {
        await verify(PGT.address, args);
    }

    log("-------------------------------------------------------");
};

module.exports.tags = ["all", "main", "lplock"];
