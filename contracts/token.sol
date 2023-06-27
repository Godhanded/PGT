// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Token is ERC20, Ownable, ERC20Permit {
    constructor() ERC20("Token", "TTT") ERC20Permit("Token") {
        _mint(msg.sender, 16720 * 10 ** decimals());
    }
}
