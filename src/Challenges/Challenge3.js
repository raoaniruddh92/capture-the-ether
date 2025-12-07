import { useState, useEffect } from 'react';
import { deploy_contract } from './Challenge2helpers/deploy';
import { interact } from './Challenge2helpers/interact';
import { SEPOLIA_CHAIN_ID } from '../config';
import { onboard } from '../config';
import './cyberpunk.css'; // ⬅ new stylesheet

function Challenges2() {
  const [wallet, setWallet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [solutionStatus, setSolutionStatus] = useState(null);
  const [deployNotification, setDeployNotification] = useState(null);

const connect = async () => {
  const wallets = await onboard.connectWallet();
  if (wallets[0]) {
    setWallet(wallets[0]);
    window.localStorage.setItem('connectedWallets', wallets[0].label); // <—
    const SEPOLIA_CHAIN_ID_HEX = `0x${SEPOLIA_CHAIN_ID.toString(16)}`;
    await onboard.setChain({ chainId: SEPOLIA_CHAIN_ID_HEX });
  }
};

  const handleDeploy = async () => {
    setIsProcessing(true);
    setDeployNotification({ message: '💾 Compiling + Deploying contract...', type: 'pending' });
    setContractAddress(null);

    try {
      const address = await deploy_contract();
      setContractAddress(address);
      setDeployNotification({ message: `⚡ Deployment Success → ${address}`, type: 'success' });
    } catch (err) {
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
    setWallet(wallets[0] || null);
  });

  // 🔥 Auto reconnect previously connected wallet
  const previouslyConnected = window.localStorage.getItem('connectedWallets');
  if (previouslyConnected) {
    onboard.connectWallet({ autoSelect: { label: previouslyConnected, disableModals: true } });
  }

  return () => sub.unsubscribe();
}, []);

  return (
    <div className="terminal-wrapper">
      <h2 className="terminal-header">GhostLedger — Level 3</h2>
<div className="challenge-list">

      <div className="terminal-card">
        {!wallet ? (
          <>
            <p className="terminal-text">🔻 STATUS: Wallet not connected.</p>
            <button className="cy-button" onClick={connect}>CONNECT WALLET</button>
          </>
        ) : (
          <p className="terminal-text">
            🟢 Connected → {wallet.accounts[0].address}
          </p>
        )}
      </div>

      <div className="terminal-card">
        <h3 className="sub-header">⚔ Mission Objective</h3>
        <p>Guess the random number ;*</p>
      </div>
      <div className="terminal-card">
        <h3>Contract Code</h3> 
<pre>
{`
pragma solidity ^0.8.21;

contract GuessTheNumberChallenge {
    uint8 answer = *redacted*;
    bool issolved=false;
    function isComplete() public view returns (bool) {
        return issolved;
    }
    function guess(uint8 n) public payable {
        if (n==answer){
            issolved=true;
        }
    }
}
`}
</pre>

    </div>
      <div className="terminal-card">
        <button className="cy-button" disabled={!wallet || isProcessing} onClick={handleDeploy}>
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

          <button className="cy-button small" disabled={isProcessing} onClick={handleCheckSolution}>
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

export default Challenges2;
