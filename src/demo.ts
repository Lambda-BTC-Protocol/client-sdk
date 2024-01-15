import { lambda } from "./lambda";

const client = lambda("http://localhost:4000");
const run = async () => {
  const balanceA = await client.balanceOf("proto", "walletA");
  console.log("proto balance", balanceA);
  const totalSupply = await client.querySingle({
    contract: "demo",
    function: "totalSupply",
    args: [],
  });
  console.log("totalsupply", totalSupply);
  const bitcoin = await client.queryToken("bitcoin");
  console.log(bitcoin);
  const demo = await client.queryToken("demo");
  console.log(demo);
  // const balance = await bitcoin.balanceOf("walletA");
  // const formattedBalance = await bitcoin.formattedBalanceOf("walletA");
  // console.log(balance, formattedBalance);

  const pool = await client.querySingle({
    contract: "amm",
    function: "getPool",
    args: ["proto"],
  });
  console.log(pool);

  const name = await client.querySingle({
    contract: "proto",
    args: [],
    function: "name",
  });
  console.log(name);

  const listings = await client.querySingle({
    contract: "otc",
    function: "listings",
    args: [],
  });
  console.log(listings);
};
run();
