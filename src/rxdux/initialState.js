export default {
  filterObject: {},
  queryObject: {},
  queryString: '',
  items: {},
  views: [], // Keep as array in order to maintain order
  // views: [
  //   {
  //      id: '',
  //      sort: {},
  //     filterGroups: [{
  //       id: '',
  //       filters: [
  //         {id: ''}
  //       ]
  //     }]
  //   }
  // ],
  selectedItems: [],
  workspace: {
    items: {} // id keyed items
  }, // {where: '[PROPNAME ie. id]', is: 'adjhfoadfh0q973580qy35'}
  loading: false, // Toggled anytime there is a filterchange, and we are waiting for results
  selectedView: '',// defaults to the first view,
  preferences: {}
};