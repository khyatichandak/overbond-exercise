const assert = require("assert");
const functions = require("../functions");
const csv = require("csvtojson");

describe("Functions", function () {
  describe("removePercentage()", function () {
    it("should return float value of % as string", function () {
      assert.equal(functions.removePercentage("12.5 %"), 12.5);
    });
    it("should return float value of % as string", function () {
      assert.equal(functions.removePercentage("12.5%"), 12.5);
    });
  });

  describe("removeYears()", function () {
    it("should return float value of year as string", function () {
      assert.equal(functions.removeYears("12.5 years"), 12.5);
    });
    it("should return float value of % as string", function () {
      assert.equal(functions.removeYears("12.5years"), 12.5);
    });
  });

  describe("linearInterpolation()", function () {
    it("should return linear interpolation value", function () {
      assert.equal(functions.linearInterpolation(1, 2, 2, 1, 2), 2);
    });
  });

  describe("map_bonds()", function () {
    it("should convert csv into json with corporates and governments as top level key", async function () {
      const data = await csv().fromFile("./Data1.csv");
      const result = functions.map_bonds(data);
      assert.equal(result.corporates.length, 7);
      assert.equal(result.governments.length, 6);
    });
  });
});

describe("Challenge 1", function () {
  describe("calculate_spread_benchmark()", function () {
    it("should return becnchmark of corporate and governments", async function () {
      const data = functions.map_bonds(await csv().fromFile("./Data1.csv"));
      const result = functions.calculate_spread_benchmark(
        data.corporates[0],
        data.governments
      );
      assert.equal(result, "C1, G1, 1.60%");
    });
  });
});

describe("Challenge 2", function () {
  describe("calculate_spread_to_curve()", function () {
    it("should return spread curve of corporate and governments", async function () {
      const data = functions.map_bonds(await csv().fromFile("./Data1.csv"));
      functions.calculate_spread_to_curve(data.corporates[0], data.governments);
    });
  });
});
