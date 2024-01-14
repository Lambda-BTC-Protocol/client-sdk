import { Token } from "./Token";
import { Query } from "./Query";
import JSONbig from "json-bigint";

const jsonBig = JSONbig({ useNativeBigInt: true });

const querySingle = async (url: string, query: Query): Promise<unknown> => {
  const singleUrl = new URL(url.endsWith("/") ? url + "query" : url + "/query");
  const params = new URLSearchParams({
    ...query,
    args: JSON.stringify(query.args),
  });
  singleUrl.search = params.toString();
  return await fetch(singleUrl, {})
    .then((res) => res.text())
    .then((res) => jsonBig.parse(res));
};

const queryMultiple = async (
  url: string,
  queries: Query[],
): Promise<unknown[]> => {
  const multiUrl = url.endsWith("/")
    ? url + "multi-query"
    : url + "/multi-query";
  return await fetch(multiUrl, {
    method: "POST",
    body: JSON.stringify(queries),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((res) => jsonBig.parse(res));
};

const queryToken = async (url: string, contract: string): Promise<Token> => {
  const response = await queryMultiple(url, [
    { function: "name", contract: contract, args: [] },
    { function: "symbol", contract: contract, args: [] },
    { function: "totalSupply", contract: contract, args: [] },
    { function: "decimals", contract: contract, args: [] },
  ]);
  const [name, symbol, totalSupply, decimals] = response as [
    string,
    string,
    bigint,
    number,
  ];
  return { name, symbol, totalSupply, decimals, contract } satisfies Token;
};

const balanceOf = async (url: string, contract: string, wallet: string) => {
  const params = {
    function: "balanceOf",
    contract: contract,
    args: [wallet],
  } satisfies Query;
  return querySingle(url, params) as Promise<bigint>;
};

const formattedBalanceOf = async (
  url: string,
  contract: string,
  wallet: string,
) => {
  const results = await queryMultiple(url, [
    { contract: contract, function: "balanceOf", args: [wallet] },
    { contract: contract, function: "decimals", args: [] },
  ]);
  const [balance, decimals] = results as [bigint, number];
  return Number(balance) / Math.pow(10, decimals);
};

export const lambda = (url: string) => ({
  /**
   * Query a token
   * @param contract
   * @returns a token object containing name, symbol, totalSupply, decimals, and contract
   */
  queryToken: (contract: string) => queryToken(url, contract),
  /**
   * Query the balance of a wallet
   * @param contract
   * @param wallet
   * @returns the balance of the wallet
   */
  balanceOf: (contract: string, wallet: string) =>
    balanceOf(url, contract, wallet),
  /**
   * Query the balance of a wallet, formatted with decimals
   * @param contract
   * @param wallet
   * @returns the balance of the wallet, formatted with decimals
   */
  formattedBalanceOf: (contract: string, wallet: string) =>
    formattedBalanceOf(url, contract, wallet),
  /**
   * Query a single function of a smart contract
   * @param query
   */
  querySingle: <T>(query: Query) => querySingle(url, query) as Promise<T>,
  /**
   * Query multiple functions of a smart contract. Only 1 request is made.
   * @param queries
   * @returns an array of results in the same order as the queries
   */
  queryMultiple: (queries: Query[]) => queryMultiple(url, queries),
});
