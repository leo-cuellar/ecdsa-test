const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x41516bdfd36ea4c9bdac316c172d35f82749c6bb": 100,
  "0x87d00b5b9e01908483e3586dae0cc198db697c11": 50,
  "0x075fafd6a4341ff0039931ddfada3f1b32495ffc": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, messageHash } = req.body;

  // verify signature
  const formattedSignature = Object.keys(signature).reduce((acc, key) => {
    if (typeof signature[key] === "string") acc[key] = BigInt(signature[key]);
    else acc[key] = signature[key];
    return acc;
  }, {});

  const signatureInstance = new secp256k1.Signature(
    formattedSignature.r,
    formattedSignature.s
  );
  signatureInstance.recovery = formattedSignature.recovery;

  const recoveredPublicKey = signatureInstance
    .recoverPublicKey(messageHash)
    .toRawBytes();

  const publicKeyNoFormat = recoveredPublicKey.slice(1);
  const hashedPublicKey = keccak256(publicKeyNoFormat);
  const addressBytes = hashedPublicKey.slice(-20);
  const address = toHex(addressBytes);

  const senderAddress = sender[0].split("x")[1];

  if (address == senderAddress) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
