/** 
 * Given state and a view or optionally a filtergroup and view, it returns just the filters array
 * */
export const getFilters = function({view, filterGroup, state}){
  const viewObject = state.views.filter(_view => _view.id === view)[0];
  const sort = viewObject.columns.reduce((acc,column) => {
    if(column.hasOwnProperty('sort') && (column.sort || column.sort === null)) { 
      acc = acc.concat([{property: column.property, sort: column.sort}]);
    }
    return acc;
  }, []);
  const pagination = {skip: viewObject._pagination.skip, take: viewObject._pagination.take, page: viewObject._pagination.page, cursor: viewObject._pagination.cursor};
  const filters = !!filterGroup 
    ? viewObject.filterGroups.filter(group => group.id === filterGroup)[0].filters
    :  viewObject.filterGroups.reduce((acc, group) => {
      return acc.concat(group.filters);
    }, []);

    return {
      filters,
      sort,
      pagination,
      view: viewObject.id
    }
}