export interface RateLimitConfig {
  requestsPerMinute: number;
  maxRequestsPerDay: number;
}

export class APIRateLimiter {
  private requestsThisMinute = 0;
  private lastMinuteReset: Date = new Date();
  private dailyRequests = 0;
  private lastResetDate: Date = new Date();
  private readonly maxRequestsPerMinute: number;
  private readonly maxRequestsPerDay: number;

  constructor(config: RateLimitConfig) {
    this.maxRequestsPerMinute = config.requestsPerMinute;
    this.maxRequestsPerDay = config.maxRequestsPerDay;
  }

  private resetIfNeeded() {
    const now = new Date();

    // Reset minute counter if a minute has passed
    if (now.getTime() - this.lastMinuteReset.getTime() >= 60000) {
      this.requestsThisMinute = 0;
      this.lastMinuteReset = now;
    }

    // Reset daily counter if it's a new day
    if (now.toDateString() !== this.lastResetDate.toDateString()) {
      this.dailyRequests = 0;
      this.lastResetDate = now;
    }
  }

  async checkLimit(): Promise<void> {
    this.resetIfNeeded();

    if (this.requestsThisMinute >= this.maxRequestsPerMinute) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    if (this.dailyRequests >= this.maxRequestsPerDay) {
      throw new Error('Daily quota exceeded. Please try again tomorrow.');
    }

    this.requestsThisMinute++;
    this.dailyRequests++;
  }

  getRemainingRateLimit(): number {
    this.resetIfNeeded();
    return Math.max(0, this.maxRequestsPerMinute - this.requestsThisMinute);
  }

  getRemainingDailyQuota(): number {
    this.resetIfNeeded();
    return Math.max(0, this.maxRequestsPerDay - this.dailyRequests);
  }
}
