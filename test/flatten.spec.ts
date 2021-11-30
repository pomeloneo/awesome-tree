import { createAwesomeTree } from '../src'
import { treeData, groupTreeData, spectreTreeData } from './data-test/tree-data'

describe('flatten', () => {
  const awesomeTree = createAwesomeTree(treeData)

  const awesomeTree1 = createAwesomeTree(groupTreeData)

  const awesomeTree2 = createAwesomeTree(spectreTreeData)

  it('work right', () => {
    
    expect(awesomeTree.flatten(awesomeTree.awsTreeNodes).map((n) => n.key)).toEqual([
      '1-1-1',
      '1-1',
      '1-2',
      '1',
      '2-1',
      '2-2',
      '2',
      '3'
    ])
    
  })

  it('work with group', () => {
    
    expect(awesomeTree1.flatten(awesomeTree1.awsTreeNodes).map((n) => n.key)).toEqual([
      '1-1-1',
      '1-1',
      '1-2',
      '1',
      '2-1',
      '2-2',
      '2'
    ])
    
  })

  it('work with spectre', () => {
    
    expect(awesomeTree2.flatten(awesomeTree2.awsTreeNodes).map((n) => n.key)).toEqual([
      '1-2',
      '1',
      '2-1',
      '2-2',
      '2'
    ])
    
  })

  it('work with single node', () => {
    
    expect(awesomeTree.flatten(awesomeTree.getNode('1') as any).map((n) => n.key)).toEqual([
      '1-1-1',
      '1-1',
      '1-2',
      '1'
    ])
    
  })

  it('not skip group', () => {
    
    expect(awesomeTree1.flatten(awesomeTree1.awsTreeNodes, false).map((n) => n.key)).toEqual([
      '1-1-1',
      '1-1',
      '1-2',
      'group-key1',
      '1',
      '2-1',
      '2-2',
      '2'
    ])
  })
  
  it('work expandedKeys', () => {

    expect(awesomeTree.flattenExpandedKeys(['1','2']).map((n) => n.key)).toEqual([
      '1-1',
      '1-2',
      '1',
      '2-1',
      '2-2',
      '2',
      '3'
    ])
  })

  it('work expandedKeys not skip group', () => {
    console.log(awesomeTree1.flattenExpandedKeys(['1','2'], false).map((n) => n.key));
    
    expect(awesomeTree1.flattenExpandedKeys(['1','2'], false).map((n) => n.key)).toEqual([
      '1-1',
      '1-2',
      'group-key1',
      '1',
      '2-1',
      '2-2',
      '2'
    ])
  })
})
