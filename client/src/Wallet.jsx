import server from "./server";

function Wallet({
  balance,
  setBalance,
  addresses,
  setAddresses,
  signature,
  setSignature,
}) {
  async function onChange(e) {
    const address = e.target.value;

    const newAddresses = Object.entries(addresses).reduce(
      (acc, [key, value]) => {
        acc[key] = { ...value, selected: address === key };
        return acc;
      },
      {}
    );

    setAddresses(newAddresses);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallets</h1>

      <label>
        Address
        <select
          name="addresses"
          value={Object.keys(addresses).filter(
            (key) => addresses[key].selected
          )}
          onChange={onChange}
        >
          {Object.keys(addresses).map((address, idx) => {
            return (
              <option key={address} value={address}>
                Address {idx + 1}: {address}
              </option>
            );
          })}
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
