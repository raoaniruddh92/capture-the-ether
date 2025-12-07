import { useState, useEffect } from 'react';
import { deploy_contract } from './Challenge1helpers/deploy';
import { interact } from './Challenge1helpers/interact';
import { SEPOLIA_CHAIN_ID } from '../config';
import { onboard } from '../config';
import './cyberpunk.css'; 

function Challenges1() {
  const [wallet, setWallet] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [solutionStatus, setSolutionStatus] = useState(null);
  const [deployNotification, setDeployNotification] = useState(null);

  const connect = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      setWallet(wallets[0]);
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
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="terminal-wrapper">
      <h2 className="terminal-header">🧠 Web3 Challenge Console — Level 1</h2>

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
        <p>Deploy the challenge smart contract on <span className="neon">Sepolia Network</span>.</p>
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
  );
}

export default Challenges1;
