import { createAwesomeTree } from '../src'
import { customChildren, customKey, groupTree, spectreTree, leafTreeData, customLeafTreeData } from './data-test/tree-data'

describe('internal util', () => {
  const awesomeTree = createAwesomeTree(customChildren, {
    getChildren(node) {
      return node.__children__
    }
  })

  const awesomeTree1 = createAwesomeTree(customKey, {
    getKey(node) {
      return node.__key
    }
  })

  const awesomeTree2 = createAwesomeTree(groupTree)

  const awesomeTree3 = createAwesomeTree(groupTree, {
    isGroup(node) {
      return (node as any).type === '__group'
    }
  })
  
  const awesomeTree4 = createAwesomeTree(spectreTree)
  
  const awesomeTree5 = createAwesomeTree(spectreTree, {
    isSpectre(node) {
      return (node as any).type === '__spectre'
    }
  })
  
  const awesomeTree6 = createAwesomeTree(leafTreeData)
  
  const awesomeTree7 = createAwesomeTree(customLeafTreeData, {
    isLeaf(node) {
      return (node as any).isLeaf === 0
    }
  })


  it('getChildren work', () => {
    expect(awesomeTree.getPath('1-1-1-1').keyPath).toEqual([
      '1',
      '1-1',
      '1-1-1',
      '1-1-1-1'
    ])
  })

  it('getKey work', () => {
    expect(awesomeTree1.getPath('1-1-1-1').keyPath).toEqual([
      '1',
      '1-1',
      '1-1-1',
      '1-1-1-1'
    ])
  })


  it('null & undefined key', () => {
    expect(awesomeTree.getNode(null)).toEqual(null)
    expect(awesomeTree.getNode(undefined)).toEqual(null)
  })

  it('not existed key', () => {
    expect(awesomeTree.getNode('do-i')).toEqual(null)
  })

  it('isGroup work', () => {
    expect(awesomeTree2.getNode('group-key1').isGroup).toEqual(true)
    expect(awesomeTree2.getNode('1-1').isGroup).toEqual(false)
  })
  
  it('custom isGroup work', () => {
    expect(awesomeTree3.getNode('group-key2').isGroup).toEqual(true)
    expect(awesomeTree3.getNode('1-1').isGroup).toEqual(false)
  })
  
  it('isSpectre work', () => {

    console.log(awesomeTree4.getNode('1-1'));
    
    expect(awesomeTree4.getNode('spectre-key1').isSpectre).toEqual(true)
    expect(awesomeTree4.getNode('1-1').isSpectre).toEqual(false)
  })
  
  it('custom isSpectre work', () => {
    expect(awesomeTree5.getNode('spectre-key2').isSpectre).toEqual(true)
    expect(awesomeTree5.getNode('1-1').isSpectre).toEqual(false)
  })
  
  
  it('isLeaf work', () => {
    expect(awesomeTree6.getNode('1-1-1-1').isLeaf).toEqual(true)
    expect(awesomeTree6.getNode('1-1').isLeaf).toEqual(false)
    expect(awesomeTree6.getNode('1-1-1').isLeaf).toEqual(true)
    expect(awesomeTree6.getNode('1').isLeaf).toEqual(false)
  })
  
  it('custom isLeaf work', () => {
    expect(awesomeTree7.getNode('1-1-1-1').isLeaf).toEqual(false)
    expect(awesomeTree7.getNode('1-1').isLeaf).toEqual(false)
    expect(awesomeTree7.getNode('1-1-1').isLeaf).toEqual(true)
    expect(awesomeTree7.getNode('1').isLeaf).toEqual(true)
  })
})
