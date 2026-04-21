# SentinelPay

A production-ready Web3 dApp representing a smart contract security layer that acts as a payment firewall for AI agents on Ethereum.

## Features
- **Smart Contract (Hardhat/Solidity):**
  - Owner-only AI agent registration with strict max spending limits.
  - Granular access controls allowing instant pausing/unpausing of AI agents.
  - Real-time logging through emitted events.
  - OpenZeppelin `ReentrancyGuard` and `Ownable` integration.
- **Frontend (Vite/React.js/ethers.js v6):**
  - Fast, responsive React frontend.
  - Dark Cyberpunk UI with 'Share Tech Mono' & 'Orbitron' fonts.
  - "Owner Dashboard" for managing AI Agents.
  - "Agent Simulator Panel" for testing execution logic.
  - Live "Transaction Log" indexing recent payments automatically.

---

## Setup Instructions

### 1. Hardhat Setup (Smart Contract Backend)

1. Clone or ensure you are in the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and fill it out:
   ```bash
   cp .env.example .env
   # Ensure you set SEPOLIA_RPC_URL and PRIVATE_KEY
   ```
4. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
5. Deploy to Sepolia testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
6. **Important:** Copy the deployed contract address printed in your terminal. You will need it for the frontend!

### 2. Frontend Setup

1. Move to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (React, Vite, ethers.js):
   ```bash
   npm install
   ```
3. Update Contract Address:
   Open `frontend/src/utils/contract.js` and update `CONTRACT_ADDRESS` with the address you received from the deployment step.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser (usually `http://localhost:5173`).

### 3. Usage Guide

- **Connect Wallet:** Ensure MetaMask is installed and set to Sepolia. Click "Connect MetaMask".
- **As the Contract Owner:** Use the 'Register New Agent' form to whitelist AI Agent addresses and grant them a spending allowance (ETH).
- **As an AI Agent:** Use the 'Agent Simulator Panel' to simulate an AI asking to spend funds. If the account isn't registered, is paused, or exceeds the limit, the transaction will be blocked by the Smart Contract.

---
*Built securely for the Decentralized Web.*
