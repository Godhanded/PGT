// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LpLock is Ownable {
    IERC20 public immutable s_lpContract;

    uint256 private immutable i_lockTime;

    event LpDeposited(address indexed _Owner, uint256 _Amount);
    event LpWithdraw(address indexed _Owner, uint256 _Amount);

    constructor(address _lpAddr) {
        s_lpContract = IERC20(_lpAddr);
        i_lockTime = block.timestamp + 24 weeks;
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(block.timestamp >= i_lockTime, "LpLock__Lock period not expired");
        s_lpContract.transfer(owner(), _amount);
        emit LpWithdraw(msg.sender, _amount);
    }

    function depositLp(uint256 _amount) external {
        s_lpContract.transferFrom(msg.sender, address(this), _amount);
        emit LpDeposited(msg.sender, _amount);
    }

    function getLockedAmount() external view returns (uint256) {
        return s_lpContract.balanceOf(address(this));
    }

    function getLockTime() external view returns (uint256) {
        return i_lockTime;
    }

    function getTimeLeft() external view returns (uint256) {
        return uint(i_lockTime - block.timestamp);
    }
}
