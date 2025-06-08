export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests = 60, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();

    // Remove old requests outside the time window
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      if (oldestRequest === undefined) {
        // If somehow the array is empty, wait for the full time window
        await new Promise((resolve) => setTimeout(resolve, this.timeWindow));
        return this.waitForSlot();
      }
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.waitForSlot();
    }

    this.requests.push(now);
  }

  getCurrentUsage(): number {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);
    return this.requests.length;
  }

  getRemainingRequests(): number {
    return this.maxRequests - this.getCurrentUsage();
  }
}

// Create a singleton instance for Gemini API
export const geminiRateLimiter = new RateLimiter(60, 60000); // 60 requests per minute
