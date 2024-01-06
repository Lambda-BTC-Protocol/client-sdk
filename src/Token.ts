import { lambda } from "./lambda";

export class Token {
  constructor(
    public contract: string,
    public decimals: number,
    public name: string,
    public symbol: string,
    public totalSupply: number,
    private queryUrl?: string,
  ) {}

  public async balanceOf(wallet: string) {
    if (!this.queryUrl) throw new Error("query url is not defined");
    return lambda(this.queryUrl).balanceOf(this.contract, wallet);
  }

  public async formattedBalanceOf(wallet: string) {
    if (!this.queryUrl) throw new Error("query url is not defined");
    return lambda(this.queryUrl).formattedBalanceOf(this.contract, wallet);
  }
}
