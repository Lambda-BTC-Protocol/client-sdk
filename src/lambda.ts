import { Token } from "./Token";
import { Query } from "./Query";
import { parse } from "superjson";
import { Transaction } from "./Transaction";
import { TransactionDetails } from "./TransactionDetails";

const querySingle = async (url: string, query: Query): Promise<unknown> => {
  const singleUrl = new URL(url.endsWith("/") ? url + "query" : url + "/query");
  const params = new URLSearchParams({
    ...query,
    args: JSON.stringify(query.args),
  });
  singleUrl.search = params.toString();
  return await fetch(singleUrl, {})
    .then((res) => res.text())
    .then((res) => parse(res));
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
    .then((res) => parse(res));
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

const queryMultipleTokens = async (
  url: string,
  contracts: string[],
): Promise<Token[]> => {
  const queries = contracts.flatMap((contract) => [
    { function: "name", contract: contract, args: [] },
    { function: "symbol", contract: contract, args: [] },
    { function: "totalSupply", contract: contract, args: [] },
    { function: "decimals", contract: contract, args: [] },
  ]);
  const response = await queryMultiple(url, queries);
  const tokens: Token[] = [];
  for (let i = 0; i < contracts.length; i++) {
    const [name, symbol, totalSupply, decimals] = response.slice(
      i * 4,
      i * 4 + 4,
    ) as [string, string, bigint, number];
    tokens.push({
      name,
      symbol,
      totalSupply,
      decimals,
      contract: contracts[i],
    });
  }
  return tokens;
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

const getBaseUrl = (url: string) => {
  return url.endsWith("/") ? url : url + "/";
};

const transactionByHash = async (
  url: string,
  hash: string,
): Promise<TransactionDetails> => {
  const txnUrl = new URL(`${getBaseUrl(url)}txn/${hash}`);
  return fetch(txnUrl).then((res) => res.json());
};

const transactionsByBlock = async (
  url: string,
  block: number,
): Promise<Array<Transaction>> => {
  const txnUrl = new URL(`${getBaseUrl(url)}txn/block/${block}`);
  return fetch(txnUrl).then((res) => res.json());
};

const transactionsByAddress = async (
  url: string,
  wallet: string,
): Promise<Array<Transaction>> => {
  const txnUrl = new URL(`${getBaseUrl(url)}txn/wallet/${wallet}`);
  return fetch(txnUrl).then((res) => res.json());
};

export const lambda = (url: string) => ({
  /**
   * Query a token
   * @param contract
   * @returns a token object containing name, symbol, totalSupply, decimals, and contract
   */
  queryToken: (contract: string) => queryToken(url, contract),
  /**
   * Query multiple tokens
   * @param contracts
   * @returns a an array of token objects containing name, symbol, totalSupply, decimals, and contract
   */
  queryTokens: (contracts: Array<string>) =>
    queryMultipleTokens(url, contracts),

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

  /**
   * Query transaction by hash
   * @param hash
   * @returns a transaction
   */
  transactionByHash: (hash: string) => transactionByHash(url, hash),

  /**
   * Query transactions by block
   * @param block
   * @returns an array of transactions
   */
  transactionsByBlock: (block: number) => transactionsByBlock(url, block),
  /**
   * Query transactions by address
   * @param address
   * @returns an array of transactions
   */
  transactionsByAddress: (address: string) =>
    transactionsByAddress(url, address),
});
