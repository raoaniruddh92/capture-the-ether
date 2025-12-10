import { useState, useEffect } from 'react';
import { deploy_contract } from './Challenge8helpers/deploy';
import { interact } from './Challenge8helpers/interact';
import { SEPOLIA_CHAIN_ID } from '../config';
import { onboard } from '../config';
import './cyberpunk.css';

function Challenges8() {
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
        <h2 className="terminal-header">🧠 GhostLedger — Level 8</h2>
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
This ERC20-compatible token is hard to acquire. There’s a fixed supply of 1,000 tokens, all of which are yours to start with.

Find a way to accumulate at least 1,000,000 tokens to solve this challenge.
            </p>
          </div>

          <div className="terminal-card">
            <h3>Contract Code</h3>
            <pre>{`
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract TokenWhale {
    address player;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    string public name = "Simple ERC20 Token";
    string public symbol = "SET";
    uint8 public decimals = 18;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(address _player) {
        player = _player;
        totalSupply = 1000;
        balanceOf[player] = 1000;
    }

    function isComplete() public view returns (bool) {
        return balanceOf[player] >= 1000000;
    }

    function _transfer(address to, uint256 value) internal {
        unchecked {
            balanceOf[msg.sender] -= value;
            balanceOf[to] += value;
        }

        emit Transfer(msg.sender, to, value);
    }

    function transfer(address to, uint256 value) public {
        require(balanceOf[msg.sender] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);

        _transfer(to, value);
    }

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function approve(address spender, uint256 value) public {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) public {
        require(balanceOf[from] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);
        require(allowance[from][msg.sender] >= value);

        allowance[from][msg.sender] -= value;
        _transfer(to, value);
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

export default Challenges8;
