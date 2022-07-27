export function format_cd(boro: string, cd: string) {
  let text: string;
  let district: string = parseInt(cd, 10).toString();

  switch (boro) {
    case '1':
      text = `Manhattan ${district}`;
      break;
    case '2':
      text = `Bronx ${district}`;
      break;
    case '3':
      text = `Brooklyn ${district}`;
      break;
    case '4':
      text = `Queens ${district}`;
      break;
    case '5':
      text = `Staten Island ${district}`;
      break;
    default:
      text = `${boro} ${district}`;
  }
  return text;
}

export function format_default(name: string) {
  return name;
}

export function format_address(
  streetName: string,
  borough: string,
  postalcode?: string,
  houseNumber?: string
) {
  let string = '';

  if (houseNumber) string += `${houseNumber} `;
  string += `${streetName}, ${borough}`;
  if (postalcode) string += `, ${postalcode}`;

  return string;
}

export function format_bid(bidName: string) {
  return bidName
    .replace('? BID', '')
    .replace('?BID', '')
    .replace(' BID', '')
    .replace('?', ' ');
}

export function get_pp_url(precinct: number) {
  if (precinct == 11 || precinct == 12 || precinct == 13) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page`;
  } else if (precinct == 14) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}th-precinct.page`;
  } else if (precinct == 18) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page`;
  } else if (precinct == 22) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page`;
  } else if (precinct % 10 == 1) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}st-precinct.page`;
  } else if (precinct % 10 == 2) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}nd-precinct.page`;
  } else if (precinct % 10 == 3) {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}rd-precinct.page`;
  } else {
    return `https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}th-precinct.page`;
  }
}
