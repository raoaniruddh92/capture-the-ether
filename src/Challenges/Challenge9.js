import { useState, useEffect } from 'react';
import { deploy_contract } from './Challenge9helpers/deploy';
import { interact } from './Challenge9helpers/interact';
import { SEPOLIA_CHAIN_ID } from '../config';
import { onboard } from '../config';
import './cyberpunk.css';

function Challenges9() {
  const [wallet, setWallet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [solutionStatus, setSolutionStatus] = useState(null);
  const [deployNotification, setDeployNotification] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ new

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
        <h2 className="terminal-header">🧠 GhostLedger — Level 9</h2>
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
This retirement fund is what economists call a commitment device. I’m trying to make sure I hold on to 0.01 ether for retirement.

I’ve committed 0.01 ether to the contract below, and I won’t withdraw it until 10 years have passed. If I do withdraw early, 10% of my ether goes to the beneficiary (you!).

I really don’t want you to have 0.001 of my ether, so I’m resolved to leave those funds alone until 10 years from now. Good luck!
            </p>
          </div>

          <div className="terminal-card">
            <h3>Contract Code</h3>
            <pre>{`
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract RetirementFund {
    uint256 startBalance;
    address owner = msg.sender;
    address beneficiary;
    uint256 expiration = block.timestamp + 520 weeks;

    constructor(address player) payable {
        require(msg.value == 0.1 ether);

        beneficiary = player;
        startBalance = msg.value;
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function withdraw() public {
        require(msg.sender == owner);

        if (block.timestamp < expiration) {
            // early withdrawal incurs a 10% penalty
            (bool ok, ) = msg.sender.call{
                value: (address(this).balance * 9) / 10
            }("");
            require(ok, "Transfer to msg.sender failed");
        } else {
            (bool ok, ) = msg.sender.call{value: address(this).balance}("");
            require(ok, "Transfer to msg.sender failed");
        }
    }

    function collectPenalty() public {
        require(msg.sender == beneficiary);
        uint256 withdrawn = 0;
        unchecked {
            withdrawn += startBalance - address(this).balance;
            require(withdrawn > 0);
        }

        (bool ok, ) = msg.sender.call{value: address(this).balance}("");
        require(ok, "Transfer to msg.sender failed");
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

export default Challenges9;
