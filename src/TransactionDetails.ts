export type TransactionDetails = {
  blockNumber: number;
  contract: string | null;
  method: string | null;
  blockTimestamp: Date;
  stateDiffBytes: number;
  inscription: string;
  origin: string;
  protocolFees: number;
  status: "SUCCESS" | "ERROR";
  errorMessage: string | null;
  parentHash: string | null;
  transactionHash: string;
  events: Array<Event>;
  children: Array<TransactionDetails>;
};

export type Event = {
  contract: string;
  type: string;
  message: string;
};
