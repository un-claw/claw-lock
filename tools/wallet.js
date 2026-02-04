#!/usr/bin/env node
/**
 * Unclaw's wallet utility - designed for autonomous operation
 * Handles RPC failover, retries, and common operations
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  mainnet: {
    rpcs: [
      'https://ethereum.publicnode.com',
      'https://eth.llamarpc.com', 
      'https://rpc.ankr.com/eth',
      'https://1rpc.io/eth'
    ],
    chainId: 1
  },
  base: {
    rpcs: [
      'https://mainnet.base.org',
      'https://base.llamarpc.com',
      'https://base.meowrpc.com',
      'https://1rpc.io/base'
    ],
    chainId: 8453
  }
};

const PK_PATH = path.join(process.env.HOME, '.config/wallet/.pk');

class WalletManager {
  constructor() {
    this.pk = fs.readFileSync(PK_PATH, 'utf8').trim();
    this.wallet = new ethers.Wallet(this.pk);
    this.providers = {};
  }

  async getProvider(network = 'base', retries = 3) {
    const config = CONFIG[network];
    if (!config) throw new Error(`Unknown network: ${network}`);

    for (let attempt = 0; attempt < retries; attempt++) {
      for (const rpc of config.rpcs) {
        try {
          const provider = new ethers.JsonRpcProvider(rpc, config.chainId, {
            staticNetwork: true
          });
          // Test connection
          await Promise.race([
            provider.getBlockNumber(),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
          ]);
          return provider;
        } catch (e) {
          // Try next RPC
        }
      }
      // Wait before retry
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
    throw new Error(`Could not connect to ${network} after ${retries} attempts`);
  }

  async getConnectedWallet(network = 'base') {
    const provider = await this.getProvider(network);
    return this.wallet.connect(provider);
  }

  async balance(network = 'base') {
    const provider = await this.getProvider(network);
    const bal = await provider.getBalance(this.wallet.address);
    return {
      address: this.wallet.address,
      network,
      balance: ethers.formatEther(bal),
      balanceWei: bal.toString()
    };
  }

  async send(to, amountEth, network = 'base') {
    const connectedWallet = await this.getConnectedWallet(network);
    const tx = await connectedWallet.sendTransaction({
      to,
      value: ethers.parseEther(amountEth.toString())
    });
    console.log('Tx sent:', tx.hash);
    const receipt = await tx.wait();
    return {
      hash: tx.hash,
      status: receipt.status === 1 ? 'success' : 'failed',
      gasUsed: receipt.gasUsed.toString()
    };
  }

  async checkTx(txHash, network = 'base') {
    const provider = await this.getProvider(network);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) return { status: 'pending' };
    return {
      status: receipt.status === 1 ? 'success' : 'failed',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  async checkEns(name) {
    const provider = await this.getProvider('mainnet');
    const address = await provider.resolveName(name);
    return { name, address: address || null, available: !address };
  }
}

// CLI interface
async function main() {
  const wm = new WalletManager();
  const [,, cmd, ...args] = process.argv;

  try {
    switch (cmd) {
      case 'address':
        console.log(wm.wallet.address);
        break;
      
      case 'balance':
        const network = args[0] || 'base';
        const bal = await wm.balance(network);
        console.log(JSON.stringify(bal, null, 2));
        break;
      
      case 'send':
        if (args.length < 2) {
          console.error('Usage: wallet.js send <to> <amount> [network]');
          process.exit(1);
        }
        const result = await wm.send(args[0], args[1], args[2] || 'base');
        console.log(JSON.stringify(result, null, 2));
        break;
      
      case 'tx':
        const txResult = await wm.checkTx(args[0], args[1] || 'base');
        console.log(JSON.stringify(txResult, null, 2));
        break;
      
      case 'ens':
        const ensResult = await wm.checkEns(args[0]);
        console.log(JSON.stringify(ensResult, null, 2));
        break;
      
      case 'all':
        // Check all balances
        const mainnetBal = await wm.balance('mainnet');
        const baseBal = await wm.balance('base');
        console.log('=== Wallet Status ===');
        console.log('Address:', wm.wallet.address);
        console.log('Mainnet:', mainnetBal.balance, 'ETH');
        console.log('Base:', baseBal.balance, 'ETH');
        break;
      
      default:
        console.log(`
Unclaw Wallet Utility

Commands:
  address           Show wallet address
  balance [network] Check balance (default: base)
  send <to> <amt> [network]  Send ETH
  tx <hash> [network]        Check transaction status
  ens <name>        Check ENS name availability
  all               Show all balances
        `);
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

main();
