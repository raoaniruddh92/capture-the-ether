import Onboard from '@web3-onboard/core';
import metamaskSDK from '@web3-onboard/metamask';

export const INFURA_ID = 'e58130da3dee4d6c9f1ab1df59cbe8aa';
export const SEPOLIA_CHAIN_ID = 11155111;

export const chains = [
  {
    id: `0x${SEPOLIA_CHAIN_ID.toString(16)}`, // Sepolia Chain ID in Hex
    token: 'ETH',
    label: 'Sepolia Testnet',
    rpcUrl: `https://sepolia.infura.io/v3/${INFURA_ID}`
  }
];

export const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: true,
    dappMetadata: { name: 'Demo Web3Onboard' }
  }
});

export const onboard = Onboard({
  wallets: [metamaskSDKWallet],
  chains,
  appMetadata: {
    name: 'Web3-Onboard Demo',
    description: 'Web3-Onboard Demo Application',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' }
      
    ]
  },
  connect: { autoConnectLastWallet: true },
    accountCenter: {
      desktop: {
        enabled: true,
        position: 'topRight'
      },}
});