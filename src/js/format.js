export function format_cd(boro, cd) {
  let text;
  switch (boro) {
    case '1':
      text = `Manhattan - ${cd}`;
      break;
    case '2':
      text = `Bronx - ${cd}`;
      break;
    case '3':
      text = `Brooklyn - ${cd}`;
      break;
    case '4':
      text = `Queens - ${cd}`;
      break;
    case '5':
      text = `Staten Island - ${cd}`;
      break;
    default:
      text = `${boro} - ${cd}`;
  }
  return `<span class = "lighter">${text}</span>`;
}

export function format_pp(precinct) {
  if (precinct == 11 || precinct == 12 || precinct == 13) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${precinct}</a> </span>`;
  } else if (precinct == 14) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}th-precinct.page'>${precinct}</a> </span>`;
  } else if (precinct == 18) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${precinct}</a> </span>`;
  } else if (precinct == 22) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${precinct}</a> </span>`;
  } else if (precinct % 10 == 1) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}st-precinct.page'>${precinct}</a> </span>`;
  } else if (precinct % 10 == 2) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}nd-precinct.page'>${precinct}</a> </span>`;
  } else if (precinct % 10 == 3) {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}rd-precinct.page'>${precinct}</a> </span>`;
  } else {
    return `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}th-precinct.page'>${precinct}</a> </span>`;
  }
}

export function format_default(name, url = null) {
  if (url) {
    return `<span class = "lighter"><a target="_blank" href='${url}'>${name}</a> </span>`;
  }
  return `<span class = "lighter">${name}</span>`;
}
