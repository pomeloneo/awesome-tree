import { createAwesomeTree } from '../src'
import { pathTreeData } from './data-test/tree-data'

describe('path', () => {
  const awesomeTree = createAwesomeTree(pathTreeData)

  it('get right path', () => {
    expect(awesomeTree.getPath('1-1-1-1').keyPath).toEqual([
      '1',
      '1-1',
      '1-1-1',
      '1-1-1-1'
    ])
  })
})
