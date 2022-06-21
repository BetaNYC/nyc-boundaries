import type { FeatureCollection } from 'geojson'
import communityDistrictBoundaries from './community-districts.json'
import cityCouncilDistrictBoundaries from './city-council-districts.json'

export type Boundary = 'communityDistricts' | 'cityCouncilDistricts'

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
  }
]
