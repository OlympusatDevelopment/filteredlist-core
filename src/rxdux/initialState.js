export default {
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
  workspace: {
    items: {} // id keyed items
  }, // {where: '[PROPNAME ie. id]', is: 'adjhfoadfh0q973580qy35'}
  loading: false, // Toggled anytime there is a filterchange, and we are waiting for results
  selectedView: 0// defaults to the first view
};