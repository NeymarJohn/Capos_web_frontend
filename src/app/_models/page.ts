import { Sort } from './sort'

export interface Page<T> {
  [x: string]: any;
  content: T[]
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  size: number
  sort: Sort | null
  totalElements: number
  totalPages: number
}
