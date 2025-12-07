import { useState, useEffect } from 'react';
import { deploy_contract } from './Challenge1helpers/deploy';
import { interact } from './Challenge1helpers/interact';
import { SEPOLIA_CHAIN_ID } from '../config';
import { onboard } from '../config';
import './cyberpunk.css';

function Challenges4() {
  const [wallet, setWallet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [solutionStatus, setSolutionStatus] = useState(null);
  const [deployNotification, setDeployNotification] = useState(null);

  const isConnected =
    wallet && wallet.accounts && wallet.accounts.length > 0;

const connect = async () => {
  const wallets = await onboard.connectWallet();
  if (wallets[0]) {
    setWallet(wallets[0]);
    window.localStorage.setItem('connectedWallets', wallets[0].label); // <—
    const SEPOLIA_CHAIN_ID_HEX = `0x${SEPOLIA_CHAIN_ID.toString(16)}`;
    await onboard.setChain({ chainId: SEPOLIA_CHAIN_ID_HEX });
  }
};

  const disconnect = async () => {
    if (!wallet) return;
    await onboard.disconnectWallet({ label: wallet.label });
    setWallet(null);
  };

  const handleDeploy = async () => {
    setIsProcessing(true);
    setDeployNotification({ message: '💾 Compiling + Deploying contract...', type: 'pending' });
    setContractAddress(null);

    try {
      const address = await deploy_contract();
      setContractAddress(address);
      setDeployNotification({ message: `⚡ Deployment Success → ${address}`, type: 'success' });
    } catch {
      setDeployNotification({ message: '❌ Deployment Failed', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckSolution = async () => {
    if (!contractAddress) return alert("Deploy the contract first.");
    setIsProcessing(true);
    setSolutionStatus(null);

    try {
      const result = await interact(contractAddress);
      result ? setSolutionStatus("success") : setSolutionStatus("error");
    } catch {
      setSolutionStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

useEffect(() => {
  const sub = onboard.state.select('wallets').subscribe((wallets) => {
    if (wallets.length > 0) {
      setWallet(wallets[0]);
      window.localStorage.setItem('connectedWallets', wallets[0].label);
    } else {
      setWallet(null);
    }
  });

  const previouslyConnected = window.localStorage.getItem('connectedWallets');

  // 🔥 Delay autoSelect until Onboard has finished restoring state
  setTimeout(() => {
    if (previouslyConnected) {
      onboard.connectWallet({
        autoSelect: { label: previouslyConnected, disableModals: true },
      });
    }
  }, 300); // <-- important (prevents race condition)

  return () => sub.unsubscribe();
}, []);


  return (
      <div className="terminal-scroll">

    <div className="terminal-wrapper">
      <h2 className="terminal-header">🧠 GhostLedger — Level 1</h2>

      <div className="terminal-card">
        {!isConnected ? (
          <>
            <p className="terminal-text">🔻 STATUS: Wallet not connected.</p>
            <button className="cy-button" onClick={connect}>CONNECT WALLET</button>
          </>
        ) : (
          <>
            <p className="terminal-text">
              🟢 Connected → {wallet.accounts[0].address}
            </p>
            <button className="cy-button small" onClick={disconnect}>
              ❌ DISCONNECT
            </button>
          </>
        )}
      </div>

      <div className="terminal-card">
        <h3 className="sub-header">⚔ Mission Objective</h3>
        <p>
          Putting the answer in the code makes things a little too easy.

This time I’ve only stored the hash of the number. Good luck reversing a cryptographic hash!
        </p>
      </div>
<div className="terminal-card">
        <h3>Contract Code</h3> 
<pre>
{`
pragma solidity ^0.8.21;

contract GuessTheSecretNumberChallenge {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;
    bool completed=false;    
    function isComplete() public view returns (bool) {
        return completed;
    }

    function guess(uint8 n) public payable {

        if (keccak256(n) == answerHash) {
            completed=true;
        }
    }
}
`}
</pre>

    </div>
      <div className="terminal-card">
        <button className="cy-button"
          disabled={!isConnected || isProcessing}
          onClick={handleDeploy}
        >
          {isProcessing ? "PROCESSING..." : "🚀 DEPLOY CONTRACT"}
        </button>

        {deployNotification && (
          <pre className={`console-box ${deployNotification.type}`}>
            {deployNotification.message}
          </pre>
        )}
      </div>

      {contractAddress && (
        <div className="terminal-card">
          <p>📌 Contract Address: <span className="neon">{contractAddress}</span></p>

          <button
            className="cy-button small"
            disabled={isProcessing}
            onClick={handleCheckSolution}
          >
            {isProcessing ? "SCANNING..." : "🔍 VERIFY CHALLENGE"}
          </button>

          {solutionStatus === "success" && (
            <div className="success-scan">🎉 CHALLENGE COMPLETED — ACCESS GRANTED</div>
          )}
          {solutionStatus === "error" && (
            <div className="error-scan">⚠ VERIFICATION FAILED — ACCESS DENIED</div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default Challenges4;
