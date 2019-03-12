export default [
  {
    id: 'eli', 
    columns:[{property: 'id', sort: 'ASC' /** ASC, DESC, null */}, {property: 'title', visible: true}],
    filterGroups: [
      {
        id: 'figNewtons',
        filters: [
          {id: 'newtons', type: 'select', value: null},
          {id: 'figgy', type: 'select', value: null},
          {id: 'state', type: 'select', value: null},
          {id: 'languages', type: 'select', value: null}
        ]
      }
    ],
    // _pagination: {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0}
  },
  {id: 'eliWithGlasses', columns:[{property: 'id'}, {property: 'title', visible: true}]},
  {id: 'eliWithAPegLeg', columns:[{property: 'id'}, {property: 'title', visible: false}, {property: 'genre', visible: true}]}
];