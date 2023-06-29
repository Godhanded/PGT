// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

error PriceGapToken__IncorrectBalance();
error PriceGapToken__PairAlreadySet();

import {IPancakePair} from "./interfaces/IPancakeSwap.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract PriceGapToken is ERC20, Ownable, ERC20Permit {
    uint256 private immutable i_fee;

    uint256 private s_balance;

    bool s_pairSet = false;

    IPancakePair private s_pgtPair;

    event FeeWithdraw(address Owner, uint256 Amount);
    event FeePaid(address indexed User, uint256 Amount);

    constructor(
        uint256 _fee
    ) ERC20("Price Gap Token", "PGT") ERC20Permit("Price Gap Token") {
        i_fee = _fee;
        _mint(msg.sender, 16720 * 10 ** decimals());
    }

    // deduct fees from price Gap Arbitrage platform
    function payFee() external {
        (uint112 res0, uint112 res1, ) = s_pgtPair.getReserves();
        uint256 amount = (i_fee * res0) / res1;
        s_balance += amount;
        address owner = _msgSender();
        _transfer(owner, address(this), amount);
        emit FeePaid(owner, amount);
    }

    function withdrawFees(uint256 _amount) external onlyOwner {
        if (_amount > s_balance) {
            revert PriceGapToken__IncorrectBalance();
        }
        s_balance -= _amount;

        _transfer(address(this), _msgSender(), _amount);
        emit FeeWithdraw(_msgSender(), _amount);
    }

    function setPgtPair(address _pairAddr) external onlyOwner {
        if (s_pairSet) {
            revert PriceGapToken__PairAlreadySet();
        }
        s_pgtPair = IPancakePair(_pairAddr);
        s_pairSet = true;
    }

    function getFeeUsd() external view returns (uint256) {
        return i_fee;
    }

    function getCurrentFeePgt() external view returns (uint256) {
        (uint112 res0, uint112 res1, ) = s_pgtPair.getReserves();
        return (i_fee * res0) / res1;
    }

    function getFeeBalance() external view returns (uint256) {
        return s_balance;
    }

    function getPgtPair() external view returns (address) {
        return address(s_pgtPair);
    }
}
