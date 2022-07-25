import { format_cd, format_default, format_bid, get_pp_url } from './format'

export type BoundaryId =
  | 'bid'
  | 'cc'
  | 'cd'
  | 'dsny'
  | 'fb'
  | 'hc'
  | 'nta'
  | 'nycongress'
  | 'pp'
  | 'sa'
  | 'sd'
  | 'ss'
  | 'zipcode'

export interface ILayer {
  /** Human-readable name, e.g. "Community District" */
  name: string

  /** Human-readable name, plural, e.g. "Community Districts" */
  name_plural: string

  /** SQL query to fetch data from Carto */
  sql: string

  /** Color of the map label */
  textColor: string

  /** Color of the map bounds and background */
  lineColor: string

  /** Icon to display */
  icon: string

  /** Url to link to for more info */
  formatUrl?: (name: string) => string

  /** Formatted display name of district, e.g. transforms 101 to Manhattan - 1 */
  formatContent: (name: any) => string
}

type ILayers = {
  [key in BoundaryId]: ILayer
}

export const layers: ILayers = {
  cd: {
    name: 'Community District',
    name_plural: 'Community Districts',
    // Remove parks
    sql: `SELECT * FROM all_bounds WHERE id = 'cd' AND NOT namecol IN ('164','226','227','228','355','356','480','481','482','483','484','595')`,
    textColor: '#000000',
    lineColor: '#000000',
    icon: '💬',
    formatContent: name => format_cd(name[0], name.substring(1, 3))
  },
  pp: {
    name: 'Police Precinct',
    name_plural: 'Police Precincts',
    sql: `SELECT * FROM all_bounds WHERE id = 'pp'`,
    textColor: '#1c4ed8',
    lineColor: '#1c4ed8',
    icon: '🚔',
    formatUrl: precinct => get_pp_url(parseInt(precinct)),
    formatContent: name => format_default(name)
  },
  dsny: {
    name: 'Sanitation District',
    name_plural: 'Sanitation Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'dsny'`,
    textColor: '#854d0f',
    lineColor: '#854d0f',
    icon: '🗑',
    formatContent: name => format_default(name)
  },
  fb: {
    name: 'Fire Battilion',
    name_plural: 'Fire Battilions',
    sql: `SELECT * FROM all_bounds WHERE id = 'fb'`,
    textColor: '#ff9628',
    lineColor: '#ff9628',
    icon: '🔥',
    formatContent: name => format_default(name)
  },
  sd: {
    name: 'School District',
    name_plural: 'School Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'sd'`,
    textColor: '#f6b100',
    lineColor: '#f6b100',
    icon: '🎓',
    formatContent: name => format_default(name)
  },
  hc: {
    name: 'Health Center District',
    name_plural: 'Health Center Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'hc'`,
    textColor: '#009582',
    lineColor: '#2dd4bf',
    icon: '🩺',
    formatContent: name => format_default(name)
  },
  cc: {
    name: 'City Council District',
    name_plural: 'City Council Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'cc'`,
    textColor: '#66c8bf',
    lineColor: '#66c8bf',
    icon: '🗽',
    formatUrl: name => `https://council.nyc.gov/district-${name}`,
    formatContent: name => format_default(name)
  },
  nycongress: {
    name: 'Congressional District',
    name_plural: 'Congressional Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'nycongress'`,
    textColor: '#ed1212',
    lineColor: '#ed1212',
    icon: '🇺🇸',
    formatUrl: name => `https://www.govtrack.us/congress/members/NY/${name}`,
    formatContent: name => format_default(name)
  },
  sa: {
    name: 'State Assembly District',
    name_plural: 'State Assembly Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'sa'`,
    textColor: '#ed1294',
    lineColor: '#ed1294',
    icon: '🧑‍⚖️',
    formatContent: name => format_default(name)
  },
  ss: {
    name: 'State Senate District',
    name_plural: 'State Senate Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'ss'`,
    textColor: '#9912ed',
    lineColor: '#9912ed',
    icon: '⚖️',
    formatUrl: name => `https://www.nysenate.gov/district/${name}`,
    formatContent: name => format_default(name)
  },
  nta: {
    name: 'Neighborhood Tabulation Area',
    name_plural: 'Neighborhood Tabulation Areas',
    sql: `SELECT * FROM all_bounds WHERE namecol NOT IN ('park-cemetery-etc-Brooklyn','park-cemetery-etc-Queens', 'park-cemetery-etc-Bronx', 'park-cemetery-etc-Manhattan', 'park-cemetery-etc-Staten Island', 'Airport') and id = 'nta'`,
    textColor: '#e7a01c',
    lineColor: '#fdca78',
    icon: '🏘',
    formatContent: name => format_default(name)
  },
  bid: {
    name: 'Business Improvement District',
    name_plural: 'Business Improvement Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'bid'`,
    textColor: '#69ae00',
    lineColor: '#82ca14',
    icon: '💸',
    formatContent: name => format_bid(name)
  },
  zipcode: {
    name: 'Zipcode',
    name_plural: 'Zipcodes',
    sql: `SELECT * FROM all_bounds WHERE id = 'zipcode'`,
    textColor: '#666666',
    lineColor: '#666666',
    icon: '📫',
    formatContent: name => format_default(name)
  }
}
