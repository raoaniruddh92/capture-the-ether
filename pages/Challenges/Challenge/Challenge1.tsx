'use client'

import { useRef, useState } from 'react'
import { useConnectWallet, useNotifications } from '@web3-onboard/react'
import { useRouter } from 'next/router'
import { Challenges1abi, Challenges1bytecode } from '../../../utils/abi'
import { publicClient } from '@/utils/client'
import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
} from 'viem'
import { sepolia } from 'viem/chains'

export default function Challenge1() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [, customNotification] = useNotifications()
  const notifyController = useRef<{ update: Function; dismiss: Function } | null>(null)

  const [address, setAddress] = useState<string | null>(null)
  const [deploying, setDeploying] = useState(false)

  const router = useRouter()

  async function deploy() {
    if (!wallet?.provider) {
      customNotification({
        type: 'error',
        message: 'Please connect your wallet first',
        autoDismiss: 4000
      })
      return
    }

    try {
      setDeploying(true)

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum!)
})

      const [account] = await walletClient.getAddresses()

      const hash = await walletClient.deployContract({
        abi: Challenges1abi,
        account,
        bytecode: Challenges1bytecode as `0x${string}`
      })

      // Pending notification
      notifyController.current = customNotification({
        type: 'pending',
        message: 'Deploying contract...',
        autoDismiss: 0
      })

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (!receipt.contractAddress) {
        throw new Error('Deployment failed: no contract address')
      }

      setAddress(receipt.contractAddress)

      // Success notification
      notifyController.current.update({
        type: 'success',
        message: 'Contract deployed successfully!',
        autoDismiss: 5000
      })
    } catch (err) {
      console.error(err)

      notifyController.current?.update({
        type: 'error',
        message: 'Deployment failed',
        autoDismiss: 5000
      })
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Wallet connect */}
      <button
        disabled={connecting}
        onClick={() => (wallet ? disconnect(wallet) : connect())}
      >
        {connecting ? 'Connecting...' : wallet ? 'Disconnect' : 'Connect'}
      </button>

      <h1>Challenge 1</h1>

      <h2>Mission Objective</h2>
      <ol>
        <li>Install MetaMask</li>
        <li>Switch to the Sepolia test network</li>
        <li>Get some Sepolia ETH</li>
      </ol>

      <p>
        After you’ve received test ETH, click deploy to deploy the challenge
        contract. You don’t need to interact with the contract — just deploy it.
      </p>

      {/* Deploy button */}
      <button
        onClick={deploy}
        disabled={!wallet || deploying}
        style={{ marginTop: '12px' }}
      >
        {deploying ? 'Deploying...' : 'Deploy'}
      </button>

      {/* Deployed address */}
      {address && (
        <p style={{ marginTop: '16px' }}>
          <strong>Contract Address:</strong>
          <br />
          {address}
        </p>
      )}
    </div>
  )
}
