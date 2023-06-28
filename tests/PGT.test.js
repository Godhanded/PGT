const { assert, expect } = require("chai");
const { ethers, deployments, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const router = require("./constants/routerAbi.json");
const factory = require("./constants/factoryAbi.json");

const { loadFixture } = require("ethereum-waffle");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Price Gap Token Unit Test", () => {
          let PGT, deployer, tToken, pancake, Factory, pair;
          netArgs = networkConfig[network.config.chainId];

          beforeEach(async () => {
              [deployer, user1, user2] = await ethers.getSigners();
              await deployments.fixture(["all"]);
              PGT = await ethers.getContract("PriceGapToken");
              tToken = await ethers.getContract("Token");
          });

          describe("Constructor", () => {
              it("Sets the correct fee", async () => {
                  const fee = await PGT.getFeeUsd();
                  assert.equal(fee.toString(), ethers.utils.parseEther("0.1").toString());
              });

              it("Mints 16720 tokens to deployer", async () => {
                  const balance = await PGT.balanceOf(deployer.address);
                  assert.equal(
                      balance.toString(),
                      ethers.utils.parseEther("16720").toString()
                  );
              });
          });

          describe("PayFee", () => {
              async function createPairFixture() {
                  const timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
                  Factory = await ethers.getContractAt(
                      factory,
                      netArgs.factory,
                      deployer
                  );
                  pancake = await ethers.getContractAt(
                      router,
                      netArgs.pancakeSwap,
                      deployer
                  );

                  await PGT.approve(pancake.address, netArgs.amountA);
                  await tToken.approve(pancake.address, netArgs.amountB);

                  await pancake.addLiquidity(
                      PGT.address,
                      tToken.address,
                      netArgs.amountA,
                      netArgs.amountB,
                      netArgs.amountA,
                      netArgs.amountB,
                      deployer.address,
                      timeStamp + 50
                  );

                  pair = await Factory.getPair(PGT.address, tToken.address);
                  // Fixtures can return anything you consider useful for your tests
                  return { pair, timeStamp };
              }
              it("should set the correct pair address", async () => {
                  const { pair } = await loadFixture(createPairFixture);

                  await PGT.setPgtPair(pair);

                  const result = await PGT.getPgtPair();

                  assert.equal(result, pair);
              });

              it("Should deduct correct fee", async () => {
                  // const {pair}=await loadFixture(createPairFixture)
                  const timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
                  Factory = await ethers.getContractAt(
                      factory,
                      netArgs.factory,
                      deployer
                  );
                  pancake = await ethers.getContractAt(
                      router,
                      netArgs.pancakeSwap,
                      deployer
                  );

                  await PGT.approve(pancake.address, netArgs.amountA);
                  await tToken.approve(pancake.address, netArgs.amountB);

                  await pancake.addLiquidity(
                      PGT.address,
                      tToken.address,
                      netArgs.amountA,
                      netArgs.amountB,
                      netArgs.amountA,
                      netArgs.amountB,
                      deployer.address,
                      timeStamp + 50
                  );

                  pair = await Factory.getPair(PGT.address, tToken.address);
                  await PGT.setPgtPair(pair);
                  const initialBal = await PGT.balanceOf(deployer.address);

                  await expect(PGT.payFee())
                      .to.emit(PGT, "FeePaid")
                      .withArgs(deployer.address, ethers.utils.parseEther("0.5573"));

                  const finalBalalance = await PGT.balanceOf(deployer.address);

                  const sbalance = await PGT.getFeeBalance();
                  assert.equal(
                      sbalance.toString(),
                      ethers.utils.parseEther("0.5573").toString()
                  );
                  assert.equal(
                      initialBal.toString(),
                      finalBalalance.add(ethers.utils.parseEther("0.5573")).toString()
                  );
              });
          });

          describe("withdrawFees", () => {
              it("should not be able to withdraw if not owner", async () => {
                  await expect(
                      PGT.connect(user1).withdrawFees(ethers.utils.parseEther("0.1"))
                  ).to.be.revertedWith("Ownable: caller is not the owner");
              });

              it("should withdraw if owner", async () => {
                  await expect(PGT.withdrawFees("0"))
                      .to.emit(PGT, "FeeWithdraw")
                      .withArgs(deployer.address, 0);
              });
          });
      });
