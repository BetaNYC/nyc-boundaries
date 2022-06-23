import { format_cd, format_default, format_pp } from './format'

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

  /** Icon to display */
  icon: string

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
    sql: `SELECT * FROM all_bounds WHERE id = 'cd' AND NOT namecol IN ('164','226','227','228','355','356','480','481','482')`,
    icon: 'static/NYCCo_human_group_a_01.jpg',
    formatContent: name => format_cd(name[0], name.substring(1, 3))
  },
  pp: {
    name: 'Police Precinct',
    name_plural: 'Police Precincts',
    sql: `SELECT * FROM all_bounds WHERE id = 'pp'`,
    icon: 'static/NYCCo_jobs_police_01.jpg',
    formatContent: name => format_pp(name)
  },
  dsny: {
    name: 'Sanitation District',
    name_plural: 'Sanitation Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'dsny'`,
    icon: 'static/NYCCo_sanitation_garbage_01.jpg',
    formatContent: name => format_default(name)
  },
  fb: {
    name: 'Fire Battilion',
    name_plural: 'Fire Battilions',
    sql: `SELECT * FROM all_bounds WHERE id = 'fb'`,
    icon: 'static/NYCCo_jobs_firefighter_01.jpg',
    formatContent: name => format_default(name)
  },
  sd: {
    name: 'School District',
    name_plural: 'School Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'sd'`,
    icon: 'static/NYCCo_food_apple_01.jpg',
    formatContent: name => format_default(name)
  },
  hc: {
    name: 'Health Center District',
    name_plural: 'Health Center Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'hc'`,
    icon: 'static/NYCCo_jobs_doctor_01.jpg',
    formatContent: name => format_default(name)
  },
  cc: {
    name: 'City Council District',
    name_plural: 'City Council Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'cc'`,
    icon: 'static/NYCCo_government_cityhall_01.jpg',
    formatContent: name =>
      format_default(name, `https://council.nyc.gov/district-${name}`)
  },
  nycongress: {
    name: 'Congressional District',
    name_plural: 'Congressional Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'nycongress'`,
    icon: 'static/NYCCo_domestic_a_01.jpg',
    formatContent: name =>
      format_default(
        name,
        `https://www.govtrack.us/congress/members/NY/${name}`
      )
  },
  sa: {
    name: 'State Assembly District',
    name_plural: 'State Assembly Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'sa'`,
    icon: 'static/NYCCo_governement_law_01.jpg',
    formatContent: name => format_default(name)
  },
  ss: {
    name: 'State Senate District',
    name_plural: 'State Senate Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'ss'`,
    icon: 'static/NYCCo_government_justice_01.jpg',
    formatContent: name =>
      format_default(name, `https://www.nysenate.gov/district/${name}`)
  },
  nta: {
    name: 'Neighborhood Tabulation Area',
    name_plural: 'Neighborhood Tabulation Areas',
    sql: `SELECT * FROM all_bounds WHERE id = 'nta'`,
    icon: 'static/NYCCo_explore_01.jpg',
    formatContent: name => format_default(name)
  },
  bid: {
    name: 'Business Improvement District',
    name_plural: 'Business Improvement Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'bid'`,
    icon: 'static/NYCCo_jobs_a_01.jpg',
    formatContent: name => format_default(name)
  },
  zipcode: {
    name: 'Zipcode',
    name_plural: 'Zipcodes',
    sql: `SELECT * FROM all_bounds WHERE id = 'zipcode'`,
    icon: 'static/NYCCo_zip_01.jpg',
    formatContent: name => format_default(name)
  }
}
