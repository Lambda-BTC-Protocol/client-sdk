import { lambda } from "./lambda";

const client = lambda("http://localhost:4000");
const run = async () => {
  const bitcoin = await client.queryToken("bitcoin");
  console.log(bitcoin);
  const balance = await bitcoin.balanceOf("walletA");
  const formattedBalance = await bitcoin.formattedBalanceOf("walletA");
  console.log(balance, formattedBalance);

  const name = await client.querySingle({
    contract: "proto",
    args: [],
    function: "name",
  });
  console.log(name);
};
run();
