export const basicMoveTreeData = [
  {
    key: '1',
    children: [
      {
        key: '1-1'
      },
      {
        key: '1-2'
      },
      {
        key: '1-3',
        children: [
          {
            key: '1-3-1'
          },
          {
            key: '1-3-2'
          },
          {
            key: '1-3-3'
          },
          {
            key: '1-3-4'
          }
        ]
      },
      {
        key: '1-4'
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
      },
      {
        key: '2-3'
      },
      {
        key: '2-4',
        children: [
          {
            key: '2-4-1'
          }
        ]
      },
    ]
  }
]


export const disabledTreeData = [
  {
    key: '1',
    disabled: true,
    children: [
      {
        key: '1-1'
      }
    ]
  },
  {
    key: '2',
    disabled: false,
    children: [
      {
        'key': '2-1'
      }
    ]
  }
]

export const groupTreeData = [
  {
    key: '1',
    children: [
      {
        key: '1-1',
        children: [
          {
            type: 'group',
            key: 'group1',
            children: [
              {
                key: '1-2'
              },
              {
                key: '1-3'
              }
            ]
          }
        ]
      },
      {
        key: '1-4'
      }
    ]
  }
]
