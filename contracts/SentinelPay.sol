// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SentinelPay is Ownable, ReentrancyGuard {
    struct Agent {
        uint256 limit;
        uint256 totalSpent;
        bool isPaused;
        bool isRegistered;
    }

    mapping(address => Agent) public agents;

    event AgentRegistered(address indexed agent, uint256 limit);
    event PaymentExecuted(address indexed agent, address indexed recipient, uint256 amount, string reason, uint256 timestamp);
    event AgentPaused(address indexed agent);
    event AgentUnpaused(address indexed agent);
    event LimitUpdated(address indexed agent, uint256 newLimit);

    constructor() Ownable(msg.sender) {}

    // 1. Register new agent
    function registerAgent(address agentAddress, uint256 spendingLimit) external onlyOwner {
        require(agentAddress != address(0), "Invalid address");
        require(!agents[agentAddress].isRegistered, "Agent already registered");
        
        agents[agentAddress] = Agent({
            limit: spendingLimit,
            totalSpent: 0,
            isPaused: false,
            isRegistered: true
        });

        emit AgentRegistered(agentAddress, spendingLimit);
    }

    // 2. Execute Payment
    function executePayment(address payable recipient, uint256 amount, string calldata reason) external nonReentrant {
        require(agents[msg.sender].isRegistered, "Caller is not a registered agent");
        require(!agents[msg.sender].isPaused, "Agent is paused");
        require(amount > 0, "Amount must be greater than zero");
        require(agents[msg.sender].totalSpent + amount <= agents[msg.sender].limit, "Amount exceeds spending limit");
        require(address(this).balance >= amount, "Insufficient contract balance");
        require(recipient != address(0), "Invalid recipient address");

        agents[msg.sender].totalSpent += amount;
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit PaymentExecuted(msg.sender, recipient, amount, reason, block.timestamp);
    }

    // 3. Pause / Unpause
    function pauseAgent(address agentAddress) external onlyOwner {
        require(agents[agentAddress].isRegistered, "Agent not registered");
        require(!agents[agentAddress].isPaused, "Agent already paused");
        
        agents[agentAddress].isPaused = true;
        emit AgentPaused(agentAddress);
    }

    function unpauseAgent(address agentAddress) external onlyOwner {
        require(agents[agentAddress].isRegistered, "Agent not registered");
        require(agents[agentAddress].isPaused, "Agent is not paused");
        
        agents[agentAddress].isPaused = false;
        emit AgentUnpaused(agentAddress);
    }

    // 4. Update limit
    function updateLimit(address agentAddress, uint256 newLimit) external onlyOwner {
        require(agents[agentAddress].isRegistered, "Agent not registered");
        require(newLimit >= agents[agentAddress].totalSpent, "New limit cannot be less than total spent");
        
        agents[agentAddress].limit = newLimit;
        emit LimitUpdated(agentAddress, newLimit);
    }

    // 5. Get Agent Info
    function getAgentInfo(address agentAddress) external view returns (uint256 limit, uint256 totalSpent, bool isPaused, bool isRegistered) {
        Agent memory a = agents[agentAddress];
        return (a.limit, a.totalSpent, a.isPaused, a.isRegistered);
    }

    // 6. Withdraw Funds
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    // 7. Receive ETH
    receive() external payable {}
}
