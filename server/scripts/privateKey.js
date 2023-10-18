const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

const getETHAddress = (publicKey) => {
  const publicKeyNoFormat = publicKey.slice(1);
  const hashedPublicKey = keccak256(publicKeyNoFormat);
  const addressBytes = hashedPublicKey.slice(-20);
  const address = toHex(addressBytes);

  return "0x" + address;
};

const privateKey = secp256k1.utils.randomPrivateKey();
const privateKeyHex = toHex(privateKey);
const publicKey = secp256k1.getPublicKey(privateKeyHex);
const publicKeyHex = toHex(publicKey);

const address = getETHAddress(publicKey);

console.log({
  privateKey: privateKeyHex,
  publicKey: publicKeyHex,
  ethAddress: address,
});
