function removePercentage(yield_val) {
  const yield = parseFloat(yield_val.slice(0, -1)).toFixed(2);
  return parseFloat(yield);
}

function removeYears(year_val) {
  const year = parseFloat(year_val.split(" ")[0]).toFixed(2);
  return parseFloat(year);
}

function linearInterpolation(x1, x2, x3, y1, y3) {
  const y2 = ((x2 - x1) * (y3 - y1)) / (x3 - x1) + y1;
  return parseFloat(y2);
}

function map_bonds(data) {
  const all_bonds = {};
  const corporate_bonds = [];
  const government_bonds = [];
  for (item in data) {
    if (data[item].bond.includes("C")) {
      corporate_bonds.push(data[item]);
    } else {
      government_bonds.push(data[item]);
    }
  }
  all_bonds.corporates = corporate_bonds;
  all_bonds.governments = government_bonds;
  return all_bonds;
}

function calculate_spread_benchmark(corporate, governments) {
  const corporate_year = removeYears(corporate.term);
  const min_govt_year = removeYears(governments[0].term);
  let min = Math.abs(corporate_year, min_govt_year);
  let benchmark = governments[0].term;
  let min_govt_yield = removePercentage(governments[0].yield);

  governments.map((government, index) => {
    const govt_year = removeYears(government.term);
    const govt_yield = removePercentage(government.yield);

    let diff = Math.abs(corporate_year - govt_year);

    if (diff < min) {
      min = diff;
      benchmark = government.bond;
      min_govt_yield = govt_yield;
    }
  });
  const spread_to_benchmark = Math.abs(
    removePercentage(corporate.yield) - min_govt_yield
  );

  return (
    corporate.bond +
    ", " +
    benchmark +
    ", " +
    spread_to_benchmark.toFixed(2) +
    "%"
  );
}

function calculate_spread_to_curve(corporate, governments) {
  const corporate_year = removeYears(corporate.term);
  governments.map((government, index) => {
    const govt_year = removeYears(government.term);
    if (
      governments[index + 1] &&
      corporate_year > govt_year &&
      corporate_year < removeYears(governments[index + 1].term)
    ) {
      const x1 = govt_year;
      const x2 = corporate_year;
      const x3 = removeYears(governments[index + 1].term);
      const y1 = removePercentage(government.yield);
      const y3 = removePercentage(governments[index + 1].yield);
      const y2 = linearInterpolation(x1, x2, x3, y1, y3);
      console.log(
        corporate.bond +
          "," +
          Math.abs(removePercentage(corporate.yield) - y2).toFixed(2) +
          "%"
      );
    }
  });
}

exports.removePercentage = removePercentage;
exports.removeYears = removeYears;
exports.linearInterpolation = linearInterpolation;
exports.map_bonds = map_bonds;
exports.calculate_spread_benchmark = calculate_spread_benchmark;
exports.calculate_spread_to_curve = calculate_spread_to_curve;
