import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak.js";

const getETHAddress = (publicKey) => {
  const publicKeyNoFormat = publicKey.slice(1);
  const hashedPublicKey = keccak256(publicKeyNoFormat);
  const addressBytes = hashedPublicKey.slice(-20);
  const address = toHex(addressBytes);

  return "0x" + address;
};

function App() {
  const [balance, setBalance] = useState(0);

  const [privateKeys, setPrivateKeys] = useState([
    "6df8f971e2c7c668424aeb9ffdd3faa90a4f426ce46bcd2b1a0e1f84407bc68e",
    "2325ad30ea6f3294d0c5dcf041f9e059b530af7647ef60bd5a30bcbbb82b3204",
    "da9c74588350fd7f95ece5ff156d72c7a2bf4aaab80669b845911e477f620e65",
  ]);

  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    setAddresses(() =>
      privateKeys.reduce((acc, privateKey, idx) => {
        const publicKey = secp256k1.getPublicKey(privateKey);
        const address = getETHAddress(publicKey);
        acc[address] = {
          privateKey,
          selected: idx === 0 ? true : false,
        };
        return acc;
      }, {})
    );
  }, [privateKeys]);

  return (
    <div className="app">
      {Object.keys(addresses).length > 0 && (
        <Wallet
          balance={balance}
          setBalance={setBalance}
          addresses={addresses}
          setAddresses={setAddresses}
          signature={privateKeys}
          setSignature={setPrivateKeys}
        />
      )}
      <Transfer setBalance={setBalance} addresses={addresses} />
    </div>
  );
}

export default App;
