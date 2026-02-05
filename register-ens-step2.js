const { ethers } = require('ethers');
const fs = require('fs');

const ETH_REGISTRAR_CONTROLLER = '0x253553366Da8546fC250F225fe3d25d0C782303b';

const CONTROLLER_ABI = [
  'function rentPrice(string name, uint256 duration) view returns (uint256)',
  'function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable'
];

async function main() {
  const pk = fs.readFileSync('/home/parachute/.config/wallet/.pk', 'utf8').trim();
  const secretHex = fs.readFileSync('/home/parachute/.config/wallet/ens-secret.txt', 'utf8').trim();
  
  const provider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');
  const wallet = new ethers.Wallet(pk, provider);
  const controller = new ethers.Contract(ETH_REGISTRAR_CONTROLLER, CONTROLLER_ABI, wallet);
  
  const name = 'unclaw';
  const duration = 365 * 24 * 60 * 60;
  const resolver = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63';
  
  // Get current price (might have changed slightly)
  const price = await controller.rentPrice(name, duration);
  // Add 10% buffer for price fluctuation
  const priceWithBuffer = price * 110n / 100n;
  console.log('Price with buffer:', ethers.formatEther(priceWithBuffer), 'ETH');
  
  console.log('\n--- Step 2: Registering ---');
  const registerTx = await controller.register(
    name,
    wallet.address,
    duration,
    secretHex,
    resolver,
    [],
    true,
    0,
    {
      value: priceWithBuffer,
      gasLimit: 300000
    }
  );
  console.log('Register tx hash:', registerTx.hash);
  await registerTx.wait();
  console.log('Registration confirmed!');
  console.log('\n🎉 unclaw.eth is now registered to', wallet.address);
}

main().catch(console.error);
