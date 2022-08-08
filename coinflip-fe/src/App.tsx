import './App.css';
import { useEffect, useState } from "react";
import { PhantomProvider } from './interfaces/PhantonProvider';
import { Connection, Transaction, TransactionInstruction } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';

function App() {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  useEffect(() => {
    // @ts-ignore
    setProvider(window.solana);
  }, []);
  const [walletKey, setWalletKey] = useState<PublicKey>(
    PublicKey.default
  );
  const connectWallet = async () => {
    // @ts-ignore
    const response = await window.solana.connect();
    console.log(response.publicKey.toString());
    setWalletKey(response.publicKey);
  };
  // @ts-ignore
  // console.log(window.solana);
  const flipTheCoin = async () => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network);
    let blockhash = await connection.getLatestBlockhash('finalized');
    const transaction = new Transaction().add(
      new TransactionInstruction({
        keys: [
          { pubkey: walletKey, isSigner: true, isWritable: false }
        ],
        data: Buffer.from([0x00, 0x100]),
        programId: new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"),
      })
    );
    transaction.recentBlockhash = blockhash.blockhash;
    // @ts-ignore
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    await connection.getSignatureStatus(signature);
  };
  return (
    <>
      <h2>Connect to Phantom Wallet</h2>
      {provider && (
        <button onClick={connectWallet}>
          Connect to Phantom Wallet
        </button>
      )}

      {!provider && (
        <p>
          No provider found.
        </p>
      )}

      <div style={{height: 20}}></div>
      <button onClick={flipTheCoin}>Flip the coin</button>
    </>
  );
}

export default App;
