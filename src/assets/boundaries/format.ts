export function format_cd(boro: string, cd: string) {
  let text: string
  switch (boro) {
    case '1':
      text = `Manhattan - ${cd}`
      break
    case '2':
      text = `Bronx - ${cd}`
      break
    case '3':
      text = `Brooklyn - ${cd}`
      break
    case '4':
      text = `Queens - ${cd}`
      break
    case '5':
      text = `Staten Island - ${cd}`
      break
    default:
      text = `${boro} - ${cd}`
  }
  return text
}

export function format_pp(precinct: number) {
  if (precinct == 11 || precinct == 12 || precinct == 13) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${precinct}</a>`
  } else if (precinct == 14) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}th-precinct.page'>${precinct}</a>`
  } else if (precinct == 18) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${precinct}</a>`
  } else if (precinct == 22) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${precinct}</a>`
  } else if (precinct % 10 == 1) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}st-precinct.page'>${precinct}</a>`
  } else if (precinct % 10 == 2) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}nd-precinct.page'>${precinct}</a>`
  } else if (precinct % 10 == 3) {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}rd-precinct.page'>${precinct}</a>`
  } else {
    return `<a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${precinct}th-precinct.page'>${precinct}</a>`
  }
}

export function format_default(name: string, url: string = null) {
  if (url) {
    return `<a target="_blank" href='${url}'>${name}</a>`
  }
  return name
}
