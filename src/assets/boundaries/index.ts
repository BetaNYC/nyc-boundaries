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
  id: Boundary
  geojson: FeatureCollection
  label: string
  color: `rgb(${number}, ${number}, ${number})`
}

export const boundariesData: IBoundary[] = [
  {
    id: 'communityDistricts',
    geojson: communityDistrictBoundaries as FeatureCollection,
    label: 'BoroCD',
    color: 'rgb(9, 85, 182)'
  },
  {
    id: 'cityCouncilDistricts',
    geojson: cityCouncilDistrictBoundaries as FeatureCollection,
    label: 'CounDist',
    color: 'rgb(217, 34, 34)'
  },
  {
    id: 'policePrecincts',
    geojson: policePrecincts as FeatureCollection,
    label: 'precinct',
    color: 'rgb(19, 237, 237)'
  },
  {
    id: 'schoolDistricts',
    geojson: schoolDistricts as FeatureCollection,
    label: 'school_dist',
    color: 'rgb(192, 174, 7)'
  }
]
