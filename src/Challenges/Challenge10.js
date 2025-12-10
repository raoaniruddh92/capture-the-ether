import { useState, useEffect } from 'react';
import { deploy_contract } from './Challenge10helpers/deploy';
import { interact } from './Challenge10helpers/interact';
import { SEPOLIA_CHAIN_ID } from '../config';
import { onboard } from '../config';
import './cyberpunk.css';

function Challenges10() {
  const [wallet, setWallet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [solutionStatus, setSolutionStatus] = useState(null);
  const [deployNotification, setDeployNotification] = useState(null);
  const [loading, setLoading] = useState(true); 

  const isConnected =
    wallet && wallet.accounts && wallet.accounts.length > 0;

  const connect = async () => {
    if (loading) return;
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      setWallet(wallets[0]);
      window.localStorage.setItem('connectedWallets', wallets[0].label);
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
      const address = await deploy_contract(wallet.accounts[0].address);
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
    // 🔥 Boot delay so Onboard loads properly
    const bootTimer = setTimeout(() => setLoading(false), 1000);

    const sub = onboard.state.select('wallets').subscribe((wallets) => {
      if (wallets.length > 0) {
        setWallet(wallets[0]);
        window.localStorage.setItem('connectedWallets', wallets[0].label);
      } else {
        setWallet(null);
      }
    });

    const previouslyConnected = window.localStorage.getItem('connectedWallets');

    setTimeout(() => {
      if (previouslyConnected) {
        onboard.connectWallet({
          autoSelect: { label: previouslyConnected, disableModals: true },
        });
      }
    }, 300);

    return () => {
      sub.unsubscribe();
      clearTimeout(bootTimer);
    };
  }, []);

  // 🚀 Loading splash (cyberpunk spinner)
  if (loading) {
    return (
      <div className="terminal-wrapper center-screen">
        <div className="cyber-loader"></div>
        <h2 className="terminal-header glitch">Initializing Wallet Interface...</h2>
      </div>
    );
  }

  return (
    <div className="terminal-scroll">
      <div className="terminal-wrapper">
        <h2 className="terminal-header">🧠 GhostLedger — Level 3</h2>
        <div className="challenge-list">
 {!isConnected ? (

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
              </>
            )}
          </div>
          ):( (<></>)  
        )}

          <div className="terminal-card">
            <h3 className="sub-header">⚔ Mission Objective</h3>
            <p>
            Send some ether to this address to continue(Sepolia)
            </p>
          </div>

          <div className="terminal-card">
            <h3>Contract Code</h3>
            <pre>{`
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Challenge {
    address public immutable TARGET = 0x5007ac414Fd733ecE18AA057598969370921CA4A;

    uint256 public immutable STARTING_BALANCE;

    constructor() {
        STARTING_BALANCE = address(TARGET).balance;
    }

    function isSolved() external view returns (bool) {
        return TARGET.balance > STARTING_BALANCE + 0.001 ether;
    }
}
            `}</pre>
          </div>

          <div className="terminal-card">
            <button
              className="cy-button"
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
    </div>
  );
}

export default Challenges10;
