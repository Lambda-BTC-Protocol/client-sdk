import { lambda } from "./lambda";

// const client = lambda("https://query-server.fly.dev/");
const client = lambda("https://api.lambdaprotocol.io");

const run = async () => {
  const x = await client.querySingle({
    contract: "kitchen",
    function: "rewards",
    args: [
      "bc1pymguvkanjvxzhwj4m3tdsrsvurj9z237vpwh0uyj6hmaxmnccjeqvej3g4",
      "bitcoin",
    ],
  });
  console.log(x);
  const flock = await client.queryToken("LMDA");
  console.log(flock);
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

  console.log("*** TRANSACTIONS ***");

  const byBlock = await client.transactionsByBlock(835973);
  console.log(byBlock);

  const byWallet = await client.transactionsByAddress(
    "bc1qxymacpaqxwjttqc2a8ga7u0n8a95a80n0mt2hn",
  );
  console.log(byWallet);

  const byHash = await client.transactionByHash(
    "0x814aef4a6d4cbb106d24067e0a9a015513adc54611b179cdcc27b9131ff71881",
  );
  console.log(byHash);
};
run();
