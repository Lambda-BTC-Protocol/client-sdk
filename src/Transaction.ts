export type Transaction = {
  blockNumber: number;
  contract: string;
  inscription: string;
  origin: string;
  protocolFees: number;
  status: "SUCCESS" | "ERROR";
  transactionHash: string;
};
