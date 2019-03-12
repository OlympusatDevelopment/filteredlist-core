export default {
  id: 'test-fl-id', // becomes the key to a global ie. window.Filteredlist.instances['test-config-id'] exposes "this"
  writeQueryStringToUrl: true,
  base64UrlQueryString: false,
  paginationTake: 25,
  views: [
  {
      id: 'main',
      persistColumnVisibility: true, // saves settings visibility to localStorage
      filterGroups: [{
          id: 'primary-group',
          filters: [
          {
              id: 'genre-filter'
          }]
        }
      ],
      columns: [// formerly props
          {
              property: 'title',
              label: 'Title',
              // sortable: true,
              // isDate: true || () => {/* use own date fn here */},
              // display: true,
              // before: () => {}// hook for mutating before render
          }
      ]
  }],
  history: false // can pass in an instance of the history library from the parent app if desired
}