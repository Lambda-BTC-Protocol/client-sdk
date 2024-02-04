import { lambda } from "./lambda";

const client = lambda("https://query-server.fly.dev/");
const run = async () => {
  const balanceA = await client.balanceOf(
    "LMDA",
    "bc1p3dadye5ar65ekxkfh83lmgm2r90mlt5uqx2pfdfl7mdz48trdn8qnnznnu",
  );
  console.log("proto balance", balanceA);
  const totalSupply = await client.querySingle({
    contract: "LMDA",
    function: "totalSupply",
    args: [],
  });
  console.log("totalsupply", totalSupply);
  const bitcoin = await client.queryToken("bitcoin");
  console.log(bitcoin);
  const demo = await client.queryToken("LMDA");
  console.log(demo);
  // const balance = await bitcoin.balanceOf("walletA");
  // const formattedBalance = await bitcoin.formattedBalanceOf("walletA");
  // console.log(balance, formattedBalance);

  // const pool = await client.querySingle({
  //   contract: "amm",
  //   function: "getPool",
  //   args: ["proto"],
  // });
  // console.log(pool);

  const name = await client.querySingle({
    contract: "bitcoin",
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

  const tokens = await client.queryTokens(["LMDA", "bitcoin", "dep:dmt:FIRST"]);
  console.log("tokens", tokens);
};
run();
