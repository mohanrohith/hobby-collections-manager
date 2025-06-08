declare module 'limiter' {
  export interface RateLimiterOptions {
    tokensPerInterval: number;
    interval: 'second' | 'minute' | 'hour' | 'day';
  }

  export class RateLimiter {
    constructor(options: RateLimiterOptions);
    tryRemoveTokens(count: number): Promise<boolean>;
    getTokensRemaining(): number;
  }
}
