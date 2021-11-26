export const treeData = [
  {
    key: '1',
    children: [
      {
        key: '1-1',
        children: [
          {
            key: '1-1-1'
          },
        ]
      },
      {
        key: '1-2'
      }
    ]
  },
  {
    key: '2',
    children: [
      {
        key: '2-1'
      },
      {
        key: '2-2'
      }
    ]
  },
  {
    key: '3'
  }
]

export const groupTreeData = [
  {
    key: '1',
    children: [
      {
        type: 'group',
        key: 'group-key1',
        children: [
          {
            key: '1-1',
            children: [
              {
                key: '1-1-1'
              },
            ]
          },
          {
            key: '1-2'
          }
        ]
      }
    ]
  },
  {
    key: '2',
    children: [
      {
        key: '2-1'
      },
      {
        key: '2-2'
      }
    ]
  },
]

export const spectreTreeData = [
  {
    key: '1',
    children: [
      {
        key: '1-1',
        type: 'spectre',
        children: [
          {
            key: '1-1-1'
          },
        ]
      },
      {
        key: '1-2'
      }
    ]
  },
  {
    key: '2',
    children: [
      {
        key: '2-1'
      },
      {
        key: '2-2'
      }
    ]
  },
  {
    key: '3',
    type: 'spectre'
  }
]

export const pathTreeData = [
  {
    key: '1',
    children: [
      {
        key: '1-1',
        children: [
          {
            key: '1-1-1',
            children: [
              {
                key: '1-1-1-1'
              }
            ]
          }
        ]
      }
    ]
  }
]

export const customChildren = [
  {
    key: '1',
    __children__: [
      {
        key: '1-1',
        __children__: [
          {
            key: '1-1-1',
            __children__: [
              {
                key: '1-1-1-1'
              }
            ]
          }
        ]
      }
    ]
  }
]


export const customKey = [
  {
    __key: '1',
    children: [
      {
        __key: '1-1',
        children: [
          {
            __key: '1-1-1',
            children: [
              {
                __key: '1-1-1-1'
              }
            ]
          }
        ]
      }
    ]
  }
]

export const groupTree = [
  {
    key: '1',
    children: [
      {
        type: 'group',
        key: 'group-key1',
        children: [
          {
            key: '1-1',
            children: [
              {
                key: '1-1-1'
              }
            ]
          },
          {
            key: '1-2',
            children: [
              {
                key: '1-2-1'
              }
            ]
          }
        ]
      },
      {
        type: '__group',
        key: 'group-key2',
        children: [
          {
            key: '1-3',
            children: [
              {
                key: '1-3-1'
              }
            ]
          }
        ]
      }
    ]
  }
]

export const spectreTree = [
  {
    key: '1',
    children: [
      {
        type: 'spectre',
        key: 'spectre-key1',
      },
      {
        key: '1-1',
        children: [
          {
            key: '1-1-1'
          }
        ]
      },
      {
        key: '1-2',
        children: [
          {
            key: '1-2-1'
          }
        ]
      },
      {
        type: '__spectre',
        key: 'spectre-key2',
        children: [
          {
            key: '1-3',
            children: [
              {
                key: '1-3-1'
              }
            ]
          }
        ]
      }
    ]
  }
]

export const leafTreeData = [
  {
    key: '1',
    children: [
      {
        key: '1-1',
        children: [
          {
            key: '1-1-1',
            isLeaf: true,
            children: [
              {
                key: '1-1-1-1',
              }
            ]
          }
        ]
      }
    ]
  }
]

export const customLeafTreeData = [
  {
    key: '1',
    isLeaf: 0,
    children: [
      {
        key: '1-1',
        isLeaf: 1,
        children: [
          {
            key: '1-1-1',
            isLeaf: 0,
            children: [
              {
                key: '1-1-1-1',
                isLeaf: 1,
              }
            ]
          }
        ]
      }
    ]
  }
]
