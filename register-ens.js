const { ethers } = require('ethers');
const fs = require('fs');

// ENS Registrar Controller on mainnet
const ETH_REGISTRAR_CONTROLLER = '0x253553366Da8546fC250F225fe3d25d0C782303b';

// ABI for the registrar controller (minimal)
const CONTROLLER_ABI = [
  'function available(string name) view returns (bool)',
  'function rentPrice(string name, uint256 duration) view returns (uint256)',
  'function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) pure returns (bytes32)',
  'function commit(bytes32 commitment)',
  'function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable',
  'function minCommitmentAge() view returns (uint256)',
  'function maxCommitmentAge() view returns (uint256)'
];

async function main() {
  // Setup
  const pk = fs.readFileSync('/home/parachute/.config/wallet/.pk', 'utf8').trim();
  const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
  const wallet = new ethers.Wallet(pk, provider);
  
  console.log('Wallet address:', wallet.address);
  
  const controller = new ethers.Contract(ETH_REGISTRAR_CONTROLLER, CONTROLLER_ABI, wallet);
  
  // Check availability
  const name = 'unclaw';
  const isAvailable = await controller.available(name);
  console.log('Name available:', isAvailable);
  
  if (!isAvailable) {
    console.log('Name not available!');
    return;
  }
  
  // Get price for 1 year
  const duration = 365 * 24 * 60 * 60; // 1 year in seconds
  const price = await controller.rentPrice(name, duration);
  console.log('Price for 1 year:', ethers.formatEther(price), 'ETH');
  
  // Generate random secret
  const secret = ethers.randomBytes(32);
  const secretHex = ethers.hexlify(secret);
  console.log('Secret (save this!):', secretHex);
  
  // Public resolver on mainnet
  const resolver = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63';
  
  // Make commitment
  const commitment = await controller.makeCommitment(
    name,
    wallet.address,
    duration,
    secret,
    resolver,
    [], // no records
    true, // set reverse record
    0 // no fuses
  );
  console.log('Commitment hash:', commitment);
  
  // Get gas price
  const feeData = await provider.getFeeData();
  console.log('Gas price:', ethers.formatUnits(feeData.gasPrice, 'gwei'), 'gwei');
  
  // Step 1: Commit
  console.log('\n--- Step 1: Committing ---');
  const commitTx = await controller.commit(commitment, {
    gasLimit: 100000
  });
  console.log('Commit tx hash:', commitTx.hash);
  await commitTx.wait();
  console.log('Commit confirmed!');
  
  // Save secret for step 2
  fs.writeFileSync('/home/parachute/.config/wallet/ens-secret.txt', secretHex);
  console.log('\nSecret saved. Wait 60 seconds, then run register step.');
  console.log('Price to send with register:', ethers.formatEther(price), 'ETH');
}

main().catch(console.error);
