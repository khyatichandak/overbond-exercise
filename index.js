const express = require("express");
const app = express();
const csv = require("csvtojson");
const functions = require("./functions");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  getCsvToJson();
});

function getCsvToJson() {
  const converter = csv()
    .fromFile("./Data1.csv")
    .then((data) => {
      const all_bonds = functions.map_bonds(data);
      console.log("\n\n\n***** Challenge 1 *****");
      console.log("bond,benchmark,spread_to_benchmark");
      all_bonds.corporates.map((corporate) => {
        if (corporate) {
          const benchmark = functions.calculate_spread_benchmark(
            corporate,
            all_bonds.governments
          );
          console.log(benchmark);
        }
      });
      console.log("\n\n\n***** Challenge 2 *****");
      console.log("bond,spread_to_curve");
      all_bonds.corporates.map((corporate) => {
        if (corporate) {
          functions.calculate_spread_to_curve(corporate, all_bonds.governments);
        }
      });
    });
}
