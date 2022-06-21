import type { FeatureCollection } from 'geojson'
import communityDistrictBoundaries from './community-districts.json'
import cityCouncilDistrictBoundaries from './city-council-districts.json'
import policePrecincts from './police-precincts.json'
import schoolDistricts from './school-districts.json'

export type Boundary =
  | 'communityDistricts'
  | 'cityCouncilDistricts'
  | 'policePrecincts'
  | 'schoolDistricts'

interface IBoundary {
  id: Boundary // Unique boundary ID
  geojson: FeatureCollection // Geojson object containing the district boundaries
  propertyKey: string // Name of the key within the "properties" object which points to the district number/name
  name: string // Human-readable name
  color: `rgb(${number}, ${number}, ${number})` // Color for the district boundaries
}

export const boundariesData: IBoundary[] = [
  {
    id: 'communityDistricts',
    geojson: communityDistrictBoundaries as FeatureCollection,
    propertyKey: 'BoroCD',
    name: 'Community District',
    color: 'rgb(9, 85, 182)'
  },
  {
    id: 'cityCouncilDistricts',
    geojson: cityCouncilDistrictBoundaries as FeatureCollection,
    propertyKey: 'CounDist',
    name: 'City Council District',
    color: 'rgb(217, 34, 34)'
  },
  {
    id: 'policePrecincts',
    geojson: policePrecincts as FeatureCollection,
    propertyKey: 'precinct',
    name: 'Police Precinct',
    color: 'rgb(19, 237, 237)'
  },
  {
    id: 'schoolDistricts',
    geojson: schoolDistricts as FeatureCollection,
    propertyKey: 'school_dist',
    name: 'School District',
    color: 'rgb(192, 174, 7)'
  }
]
