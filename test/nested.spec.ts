import { createAwesomeTree } from '../src'
import { treeData } from './tree-data'

describe('path', () => {
  const awesomeTree = createAwesomeTree(treeData)
  debugger
  it('work right', () => {
    expect(awesomeTree.getNode('1').nested(awesomeTree.getNode('1-1'))).toEqual(true)
    expect(awesomeTree.getNode('1').nested(awesomeTree.getNode('1-2'))).toEqual(true)
    expect(awesomeTree.getNode('1').nested(awesomeTree.getNode('2'))).toEqual(false)
    expect(awesomeTree.getNode('1').nested(awesomeTree.getNode('1-1-1'))).toEqual(true)
    expect(awesomeTree.getNode('1').nested(awesomeTree.getNode('1-1-1'), true)).toEqual(false)
  })
})
