export type BoundaryId = 'cd' | 'cc' | 'pp' | 'sd'

export interface IBoundary {
  id: BoundaryId // Unique boundary ID
  name: string // Human-readable name
  color: `rgb(${number}, ${number}, ${number})` // Color for the district boundaries
}

export const boundariesData: IBoundary[] = [
  {
    id: 'cd',
    name: 'Community District',
    color: 'rgb(9, 85, 182)'
  },
  {
    id: 'cc',
    name: 'City Council District',
    color: 'rgb(217, 34, 34)'
  },
  {
    id: 'pp',
    name: 'Police Precinct',
    color: 'rgb(19, 237, 237)'
  },
  {
    id: 'sd',
    name: 'School District',
    color: 'rgb(192, 174, 7)'
  }
]
