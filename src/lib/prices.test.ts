import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { PRICES_INR, totalInr } from "./prices";

describe("book prebooking prices", () => {
  test("A Final Pawprint costs 499 rupees", () => {
    assert.equal(PRICES_INR.quizbook, 499);
    assert.equal(totalInr(["quizbook"]), 499);
    assert.equal(totalInr(["handbook", "quizbook"]), 1019);
  });
  test("existing handbook edition prices stay unchanged", () => {
    assert.equal(PRICES_INR.handbook, 520);
    assert.equal(PRICES_INR["handbook-color"], 800);
  });
});