# Lambda Client SDK

## Getting Started

This SDK allows you to interact with Lambda Protocol contracts. You can query anything from the protocol. And there are helper methods for LRC-20 Tokens

create a client with `lambda(baseUrl)` and then you can call any of the methods.

## Methods

### Transactions

#### transactionByHash

Load a transactions by transaction hash and returns `TransactionDetails`

#### transactionsByBlock

Load transactions by block number and returns `Transaction[]`

#### transactionsByAddress

Load transactions by address and returns `Transaction[]`
