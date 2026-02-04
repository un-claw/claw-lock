#!/usr/bin/env node
/**
 * ENS Registration Script for Unclaw
 * Two-step commit-reveal process with proper error handling
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const PK_PATH = path.join(process.env.HOME, '.config/wallet/.pk');
const SECRET_PATH = path.join(process.env.HOME, '.openclaw/workspace/.secrets/ens-secret.json');

// ENS Controller on mainnet
const ETH_REGISTRAR_CONTROLLER = '0x253553366Da8546fC250F225fe3d25d0C782303b';
const CONTROLLER_ABI = [
  'function rentPrice(string name, uint256 duration) view returns (tuple(uint256 base, uint256 premium))',
  'function available(string name) view returns (bool)',
  'function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) pure returns (bytes32)',
  'function commit(bytes32 commitment)',
  'function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable',
  'function commitments(bytes32) view returns (uint256)'
];

const PUBLIC_RESOLVER = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63';

async function getProvider() {
  const rpcs = [
    'https://ethereum.publicnode.com',
    'https://1rpc.io/eth',
    'https://eth.llamarpc.com'
  ];
  
  for (const rpc of rpcs) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc, 1, { staticNetwork: true });
      await Promise.race([
        provider.getBlockNumber(),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 8000))
      ]);
      console.log('Connected to:', rpc);
      return provider;
    } catch (e) {
      console.log('Failed:', rpc);
    }
  }
  throw new Error('All RPCs failed');
}

async function main() {
  const [,, step, name] = process.argv;
  
  if (!step || !name) {
    console.log('Usage: ens-register.js <commit|register|status> <name>');
    console.log('  commit <name>   - Step 1: Make commitment');
    console.log('  register <name> - Step 2: Complete registration (wait 60s after commit)');
    console.log('  status <name>   - Check registration status');
    return;
  }

  const pk = fs.readFileSync(PK_PATH, 'utf8').trim();
  const provider = await getProvider();
  const wallet = new ethers.Wallet(pk, provider);
  const controller = new ethers.Contract(ETH_REGISTRAR_CONTROLLER, CONTROLLER_ABI, wallet);
  
  const duration = 31536000; // 1 year in seconds

  if (step === 'status') {
    const available = await controller.available(name);
    console.log('Name:', name + '.eth');
    console.log('Available:', available);
    
    if (available) {
      const price = await controller.rentPrice(name, duration);
      const totalPrice = price.base + price.premium;
      console.log('Price (1yr):', ethers.formatEther(totalPrice), 'ETH');
    }
    
    const balance = await provider.getBalance(wallet.address);
    console.log('Your balance:', ethers.formatEther(balance), 'ETH');
    return;
  }

  if (step === 'commit') {
    // Check availability
    const available = await controller.available(name);
    if (!available) {
      console.log('Name not available!');
      return;
    }

    // Generate secret
    const secret = ethers.hexlify(ethers.randomBytes(32));
    
    // Make commitment
    const commitment = await controller.makeCommitment(
      name,
      wallet.address,
      duration,
      secret,
      PUBLIC_RESOLVER,
      [],
      true, // reverse record
      0
    );

    console.log('Commitment:', commitment);
    console.log('Secret:', secret);
    
    // Send commit transaction
    const tx = await controller.commit(commitment);
    console.log('Commit tx:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Committed! Block:', receipt.blockNumber);
    
    // Save secret for register step
    const secretData = {
      name,
      secret,
      commitment,
      commitTx: tx.hash,
      commitTime: Date.now(),
      owner: wallet.address
    };
    fs.writeFileSync(SECRET_PATH, JSON.stringify(secretData, null, 2));
    console.log('\nSecret saved to', SECRET_PATH);
    console.log('\nWait at least 60 seconds, then run:');
    console.log(`  node tools/ens-register.js register ${name}`);
    return;
  }

  if (step === 'register') {
    // Load secret
    if (!fs.existsSync(SECRET_PATH)) {
      console.log('No secret found! Run commit step first.');
      return;
    }
    
    const secretData = JSON.parse(fs.readFileSync(SECRET_PATH, 'utf8'));
    if (secretData.name !== name) {
      console.log('Secret is for different name:', secretData.name);
      return;
    }

    // Check commitment age
    const commitAge = (Date.now() - secretData.commitTime) / 1000;
    if (commitAge < 60) {
      console.log(`Wait ${Math.ceil(60 - commitAge)} more seconds...`);
      return;
    }

    // Get price
    const price = await controller.rentPrice(name, duration);
    const totalPrice = price.base + price.premium;
    const priceWithBuffer = totalPrice * 110n / 100n; // 10% buffer
    
    console.log('Price:', ethers.formatEther(totalPrice), 'ETH');
    console.log('Sending:', ethers.formatEther(priceWithBuffer), 'ETH (with buffer)');

    // Register
    const tx = await controller.register(
      name,
      secretData.owner,
      duration,
      secretData.secret,
      PUBLIC_RESOLVER,
      [],
      true,
      0,
      { value: priceWithBuffer }
    );
    
    console.log('Register tx:', tx.hash);
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log('\n🎉 SUCCESS! You now own', name + '.eth');
      // Clean up secret
      fs.unlinkSync(SECRET_PATH);
    } else {
      console.log('Transaction failed!');
    }
    return;
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
