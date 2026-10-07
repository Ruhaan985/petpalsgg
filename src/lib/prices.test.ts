import { describe, expect, test } from "bun:test";
import { PRICES_INR, totalInr } from "./prices";

describe("book prebooking prices", () => {
  test("A Final Pawprint costs 499 rupees", () => {
    expect(PRICES_INR.quizbook).toBe(499);
    expect(totalInr(["quizbook"])).toBe(499);
    expect(totalInr(["handbook", "quizbook"])).toBe(1019);
  });
  test("existing handbook edition prices stay unchanged", () => {
    expect(PRICES_INR.handbook).toBe(520);
    expect(PRICES_INR["handbook-color"]).toBe(800);
  });
});