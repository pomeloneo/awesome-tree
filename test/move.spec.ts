import { createAwesomeTree } from '../src'
import {basicMoveTreeData, disabledTreeData} from './data-test/data-move'

describe('move methods', () => {
  const awesomeTree = createAwesomeTree(basicMoveTreeData)
  const awesomeTree1 = createAwesomeTree(disabledTreeData)
  const { getFirstAvailableNode } = awesomeTree1

  // getFirstAvailableNode

  it('getFirstAvailableNode basic work', () => {
    debugger
    expect(getFirstAvailableNode().key).toEqual('2')
  })

  
  // move by getParent getChild getPrev getNext
  it('move by getParent getChild getPrev getNext work', () => {
    let currentNode = awesomeTree.getNode('1')
    currentNode = currentNode.getNext()
    expect(currentNode.key).toEqual('2')
    expect(currentNode.getChild().key).toEqual('2-1')
    currentNode = currentNode.getPrev()
    expect(currentNode.key).toEqual('1')
    expect(currentNode.getChild().key).toEqual('1-1')
    expect(currentNode.getPrev()).toEqual(null)
    currentNode = currentNode.getChild().getNext().getNext()
    expect(currentNode.key).toEqual('1-3')
    expect(currentNode.getChild().key).toEqual('1-3-1')
    currentNode = currentNode.getParent()
    expect(currentNode.key).toEqual('1')
  })
  it('parent is group', () => {
    expect(awesomeTree.getNode('1-3-1').getParent().key).toEqual('1-3')
  })

  // move by key
  it('move by key', () => {
    const {getParent, getChild, getPrev, getNext} = awesomeTree
    let currentNode = null
    currentNode = getNext('1')
    expect(currentNode.key).toEqual('2')
    currentNode = getPrev('2')
    expect(currentNode.key).toEqual('1')
    currentNode = getParent('1')
    expect(currentNode).toEqual(null)
    currentNode = getChild('2')
    expect(currentNode.key).toEqual('2-1')
    currentNode = getChild('2-1')
    expect(currentNode).toEqual(null)
    currentNode = getParent('2-1')
    expect(currentNode.key).toEqual('2')
    currentNode = getParent('2-4-1')
    expect(currentNode.key).toEqual('2-4')
    currentNode = getNext('1-3')
    expect(currentNode.key).toEqual('1-4')
    currentNode = getNext('1-4')
    expect(currentNode).toEqual(null)
  })
})
