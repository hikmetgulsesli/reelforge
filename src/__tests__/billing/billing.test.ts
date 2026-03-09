import {
  calculateCredits,
  PLAN_CREDITS,
  PLANS,
} from "../../lib/billing";

// Test credit calculation
describe("calculateCredits", () => {
  it("returns 1 credit for videos up to 15 seconds", () => {
    expect(calculateCredits(5)).toBe(1);
    expect(calculateCredits(15)).toBe(1);
  });

  it("returns 2 credits for videos 16-30 seconds", () => {
    expect(calculateCredits(16)).toBe(2);
    expect(calculateCredits(30)).toBe(2);
  });

  it("returns 3 credits for videos 31-60 seconds", () => {
    expect(calculateCredits(31)).toBe(3);
    expect(calculateCredits(60)).toBe(3);
  });

  it("calculates credits correctly for longer videos", () => {
    expect(calculateCredits(90)).toBe(5); // ceil(90/20) = 5
    expect(calculateCredits(120)).toBe(6); // ceil(120/20) = 6
    expect(calculateCredits(180)).toBe(9); // ceil(180/20) = 9
  });
});

// Test PLAN_CREDITS
describe("PLAN_CREDITS", () => {
  it("has starter plan with correct credits and price", () => {
    expect(PLAN_CREDITS.starter).toEqual({ credits: 30, price: 1900 });
  });

  it("has pro plan with correct credits and price", () => {
    expect(PLAN_CREDITS.pro).toEqual({ credits: 80, price: 4900 });
  });

  it("has business plan with correct credits and price", () => {
    expect(PLAN_CREDITS.business).toEqual({ credits: 200, price: 9900 });
  });
});

// Test PLANS
describe("PLANS", () => {
  it("has free plan with 3 credits", () => {
    expect(PLANS.free).toEqual({ name: "Ücretsiz", credits: 3, price: 0 });
  });

  it("has starter plan with 30 credits at $19", () => {
    expect(PLANS.starter).toEqual({ name: "Starter", credits: 30, price: 19 });
  });

  it("has pro plan with 80 credits at $49", () => {
    expect(PLANS.pro).toEqual({ name: "Pro", credits: 80, price: 49 });
  });

  it("has business plan with 200 credits at $99", () => {
    expect(PLANS.business).toEqual({ name: "Business", credits: 200, price: 99 });
  });
});
