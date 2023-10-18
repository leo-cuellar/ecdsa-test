import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ addresses, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(e) {
    e.preventDefault();

    const postObject = {
      sender: Object.keys(addresses).filter((key) => addresses[key].selected),
      amount: parseInt(sendAmount),
      recipient,
    };

    const hashedData = toHex(
      keccak256(utf8ToBytes(JSON.stringify(postObject)))
    );

    const privateKey = Object.values(addresses).filter(
      (value) => value.selected
    )[0].privateKey;
    const signature = secp256k1.sign(hashedData, privateKey);
    const formattedSignature = Object.keys(signature).reduce((acc, key) => {
      if (typeof signature[key] === "bigint")
        acc[key] = signature[key].toString();
      else acc[key] = signature[key];
      return acc;
    }, {});

    postObject.signature = formattedSignature;
    postObject.messageHash = hashedData;
    try {
      const {
        data: { balance },
      } = await server.post(`send`, postObject);
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
