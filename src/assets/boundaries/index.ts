import {
  format_cd,
  format_default,
  format_bid,
  get_pp_url,
  get_cd_url
} from './format';

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
  | 'hd'
  | 'ibz'
  | 'cc_upcoming';

export interface ILayer {
  /** Human-readable name, e.g. "Community District" */
  name: string;

  /** Human-readable name, plural, e.g. "Community Districts" */
  name_plural: string;

  /** Succinct definition of what this boundary represents. */
  description: string;

  /** Optional 'learn more' link for the description. */
  description_url?: string;

  /** SQL query to fetch data from Carto */
  sql: string;

  /** Icon to display */
  icon: string;

  /** Url to link to for more info */
  formatUrl?: (name: string) => string;

  /** Formatted display name of district, e.g. transforms 101 to Manhattan - 1 */
  formatContent: (name: any) => string;
}

type ILayers = {
  [key in string]: ILayer;
};

export const layers: ILayers = {
  cd: {
    name: 'Community District',
    name_plural: 'Community Districts',
    description:
      'Community Boards advise on land use and zoning, participate in the city budget process, and address service delivery in their district. They have up to 50 up to 50 volunteer members appointed by the borough president.',
    description_url: 'https://communityprofiles.planning.nyc.gov/',
    // Remove parks
    sql: `SELECT * FROM all_bounds WHERE id = 'cd' AND NOT namecol IN ('164','226','227','228','355','356','480','481','482','483','484','595')`,
    icon: '💬',
    formatUrl: name => get_cd_url(name[0], name.substring(1, 3)),
    formatContent: name => format_cd(name[0], name.substring(1, 3))
  },
  pp: {
    name: 'Police Precinct',
    name_plural: 'Police Precincts',
    description:
      'A police precinct is a geographical area patrolled by the NYPD. The term "precinct" may also refer to the main police station for such a geographical area.',
    description_url: 'https://www1.nyc.gov/site/nypd/index.page',
    sql: `SELECT * FROM all_bounds WHERE id = 'pp'`,
    icon: '🚔',
    formatUrl: precinct => get_pp_url(parseInt(precinct)),
    formatContent: name => format_default(name)
  },
  dsny: {
    name: 'Sanitation District',
    name_plural: 'Sanitation Districts',
    description:
      'For operations management, the Department of Sanitation (DSNY) divides the city into 59 Sanitation Districts. The boundary for each district is congruent with the Community District boundary.',
    description_url: 'https://www1.nyc.gov/assets/dsny/site/home',
    sql: `SELECT * FROM all_bounds WHERE id = 'dsny'`,
    icon: '🗑',
    formatContent: name => format_default(name)
  },
  fb: {
    name: 'Fire Battalion',
    name_plural: 'Fire Battalions',
    description:
      'A Fire Battalion consists of several fire stations and multiple fire companies, and is led by a Battalion Chief.',
    sql: `SELECT * FROM all_bounds WHERE id = 'fb'`,
    icon: '🔥',
    formatContent: name => format_default(name)
  },
  sd: {
    name: 'School District',
    name_plural: 'School Districts',
    description:
      'A School District is a geographical area with multiple schools.',
    description_url: 'https://www.schools.nyc.gov/',
    sql: `SELECT * FROM all_bounds WHERE id = 'sd'`,
    icon: '🎓',
    formatContent: name => format_default(name)
  },
  hc: {
    name: 'Health Center District',
    name_plural: 'Health Center Districts',
    description:
      'Health Center Districts are aggregates of health areas and are used for reporting health statistics. They were created by the NYC Department of Health and Mental Hygiene (DOHMH).',
    sql: `SELECT * FROM all_bounds WHERE id = 'hc'`,
    icon: '🩺',
    formatContent: name => format_default(name)
  },
  cc: {
    name: 'City Council District (prior to 2024)',
    name_plural: 'City Council District (prior to 2024)',
    description: 'The New York City Council lines prior to 2024.',
    description_url: 'https://council.nyc.gov/',
    sql: `SELECT * FROM all_bounds WHERE id = 'cc'`,
    icon: '🗽',
    formatUrl: name => `https://council.nyc.gov/district-${name}`,
    formatContent: name => format_default(name)
  },
  cc_upcoming: {
    name: 'City Council District',
    name_plural: 'City Council Districts',
    description:
      'The New York City Council is the lawmaking body of New York City. It has 51 members from 51 council districts throughout the five boroughs. The district lines have been updated in 2024.',
    description_url: 'https://council.nyc.gov/',
    sql: `SELECT * FROM all_bounds WHERE id = 'cc_upcoming'`,
    icon: '🍎',
    formatUrl: name => `https://council.nyc.gov/district-${name}`,
    formatContent: name => format_default(name)
  },
  nycongress: {
    name: 'Congressional District',
    name_plural: 'Congressional Districts',
    description:
      'Congressional Districts are the 435 regions from which voting representatives are elected to the U.S. House of Representatives.',
    description_url: 'https://www.house.gov/',
    sql: `SELECT * FROM all_bounds WHERE id = 'nycongress'`,
    icon: '🇺🇸',
    formatUrl: name => `https://www.govtrack.us/congress/members/NY/${name}`,
    formatContent: name => format_default(name)
  },
  sa: {
    name: 'State Assembly District',
    name_plural: 'State Assembly Districts',
    description:
      'The New York State Assembly is the lower house of the New York State Legislature, with the New York State Senate being the upper house. There are 150 seats in the Assembly.',
    description_url: 'https://nyassembly.gov/',
    sql: `SELECT * FROM all_bounds WHERE id = 'sa'`,
    icon: '🧑‍⚖️',
    formatUrl: name =>
      `https://ballotpedia.org/New_York_State_Assembly_District_${name}`,
    formatContent: name => format_default(name)
  },
  ss: {
    name: 'State Senate District',
    name_plural: 'State Senate Districts',
    description:
      'The New York State Senate is the upper house of the New York State Legislature; the New York State Assembly is its lower house. Its members are elected to two-year terms; there are no term limits. There are 63 seats in the Senate.',
    description_url: 'https://www.nysenate.gov/',
    sql: `SELECT * FROM all_bounds WHERE id = 'ss'`,
    icon: '⚖️',
    formatUrl: name => `https://www.nysenate.gov/district/${name}`,
    formatContent: name => format_default(name)
  },
  nta: {
    name: 'Neighborhood Tabulation Area',
    name_plural: 'Neighborhood Tabulation Areas',
    description:
      'Neighborhood Tabulation Areas are aggregations of census tracts, adapted as a method of presenting the U.S. Census Bureau’s American Community Survey (ACS).',
    sql: `SELECT * FROM all_bounds WHERE namecol NOT IN ('park-cemetery-etc-Brooklyn','park-cemetery-etc-Queens', 'park-cemetery-etc-Bronx', 'park-cemetery-etc-Manhattan', 'park-cemetery-etc-Staten Island', 'Airport') and id = 'nta'`,
    icon: '🏘',
    formatContent: name => format_default(name)
  },
 // @ts-ignore
  hd: {
    name: 'Historic District',
    name_plural: 'Historic Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'hd'`,
    icon: '🗝',
    formatContent: name => format_default(name)
  },
  bid: {
    name: 'Business Improvement District',
    name_plural: 'Business Improvement Districts',
    description:
      'A Business Improvement District (BID) is a geographical area where local stakeholders oversee and fund the maintenance, improvement, and promotion of their commercial district, going above and beyond those typically provided by the city.',
    description_url: 'https://www1.nyc.gov/site/sbs/neighborhoods/bids.page',
    sql: `SELECT * FROM all_bounds WHERE id = 'bid'`,
    icon: '💸',
    formatContent: name => format_bid(name)
  },
  ibz: {
    name: 'Industrial Business Zone',
    name_plural: 'Industrial Business Zones',
    description:
      'A Industrial Business Zone (IBZ) is a geographic area that serve as safe havens for manufacturing and industrial firms.',
    description_url: 'https://edc.nyc/industry/industrial-and-manufacturing',
    sql: `SELECT * FROM all_bounds WHERE id = 'ibz'`,
    icon: '🏭',
    formatContent: name => format_default(name)
  },
  zipcode: {
    name: 'Zipcode',
    name_plural: 'Zipcodes',
    description:
      'A ZIP Code is a postal code used by the United States Postal Service (USPS).',
    sql: `SELECT * FROM all_bounds WHERE id = 'zipcode'`,
    icon: '📫',
    formatContent: name => format_default(name)
  }
};
