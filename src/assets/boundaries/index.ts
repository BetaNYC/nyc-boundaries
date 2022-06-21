import type { FeatureCollection } from 'geojson'
import communityDistrictBoundaries from './community-districts.json'
import cityCouncilDistrictBoundaries from './city-council-districts.json'

export type Boundary = 'communityDistricts' | 'cityCouncilDistricts'

interface IBoundary {
  id: Boundary
  geojson: FeatureCollection
  label: string
}

export const boundariesData: IBoundary[] = [
  {
    id: 'communityDistricts',
    geojson: communityDistrictBoundaries as FeatureCollection,
    label: 'BoroCD'
  },
  {
    id: 'cityCouncilDistricts',
    geojson: cityCouncilDistrictBoundaries as FeatureCollection,
    label: 'CounDist'
  }
]
