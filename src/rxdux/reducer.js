import initialState from './initialState';
import {
  __TEST_RUNNER,
  RESET,
  ADD_ITEM_TO_WORKSPACE,
  REMOVE_ITEM_FROM_WORKSPACE,
  CLEAR_WORKSPACE,
  UPDATE_QUERY_STRING,
  UPDATE_QUERY_OBJECT,
  UPDATE_FILTER_OBJECT,
  PUSH_ITEMS_TO_STORE,
  REPLACE_ITEMS,
  CLEAR_ITEMS,
  UPDATE_ITEM,
  REPLACE_SELECTED_ITEMS,
  CLEAR_SELECTED_ITEMS,
  SET_VIEWS,
  SELECT_VIEW,
  UPDATE_VIEW,
  UPDATE_COLUMN_VISIBILTY,
  SET_ALL_COLUMNS_VISIBLE,
  UNSET_ALL_COLUMNS_VISIBLE,
  RUN_FILTER,
  RESET_FILTERS
} from '../constants';
import _merge from 'lodash.merge';
import {getFilters} from '../utils';
import {makeFilterQueryData} from '../apis/queries';
const paginationDefault = {cursor: null, page: 1, skip: 0, take: 25, totalItems: 0, takeOptions: [10, 25, 50, 75, 100]};

/** 
 * Curried. Takes the options and hooks, then returns a real reducer; 
 * */
export default (options, hooks) => (state = initialState, action) => {
  let _state = {...state};
  let _data =  action.data;

  switch(action.type) {
    case __TEST_RUNNER: 
      _state = {..._state, ..._data};
      return _state;

    case RESET: 
      _state = _data;

      return _state;

    case ADD_ITEM_TO_WORKSPACE: 
      _state.workspace.items[_data.id] = _data.item;

      return _state;

    case REMOVE_ITEM_FROM_WORKSPACE: 
      delete _state.workspace.items[_data.id];

      return _state;

    case CLEAR_WORKSPACE: 
      _state.workspace.items = {};

      return _state;

    case UPDATE_QUERY_STRING:
      _state.queryString = _data.queryString;

      return _state;

    case UPDATE_FILTER_OBJECT:
      _state.filterObject = _data.filterObject;

      return _state;
    
    case UPDATE_QUERY_OBJECT:
      _state.queryObject = _data.queryObject;

      return _state;
    
    case PUSH_ITEMS_TO_STORE:
      _state.items = _merge(_state.items, _data.items);

      // Update item count
      _state.views.map(view => {
        if(view.id === _state.selectedView) {
          view._pagination.totalItems = _data.totalItems || 0;
        }
      });

      return _state;
    
    case REPLACE_ITEMS:
      _state.items = _data.items;

      // Update item count
      _state.views.map(view => {
        if(view.id === _state.selectedView) {
          view._pagination.totalItems = _data.totalItems || 0;
        }
      });

      return _state;
    
    case UPDATE_ITEM:
      _state.items[_data.id] = Object.assign({}, _state.items[_data.id], _data.item);

      return _state;
    
    case CLEAR_ITEMS:
      _state.items = {}; 

      // Update item count
      _state.views.map(view => {
        if(view.id === _state.selectedView) {
          view._pagination = paginationDefault;
        }
      });

      return _state;
    
    case REPLACE_SELECTED_ITEMS:
      _state.items = _data.selectedItems;

      return _state;

    case CLEAR_SELECTED_ITEMS:
      _state.selectedItems = []; 

      return _state;

    case SET_VIEWS:
      // Views must be an array, but we can pass a single view in if we want
      if (!Array.isArray(_data.views)) { _data.views = [_data.views]; }

      // Includes & defaults for views
      _data.views.map(view => {
        //TODO: Consult with Adam on moving the paginationDefault to view config
        // if (!view._pagination) { view['_pagination'] = view.pagination; }
        if (!view._pagination) { view['_pagination'] = paginationDefault; }
        if (!view.filterGroups) { view['filterGroups'] = []; }
      });

      _state.views = _data.views;
      _state.selectedView = _data.views[0].id; // set selected view as the first item

      return _state;

    case SELECT_VIEW:
      _state.selectedView = _data.id; 

      return _state;

    case UPDATE_VIEW:
      _state.views = _state.views.map(view => {
        if (view.id === _data.id) {
          view = _merge(view, _data.view);
        }

        return view;
      });

      return _state;

    case UPDATE_COLUMN_VISIBILTY:
      const _updates = Array.isArray(_data.updates) ? _data.updates : [_data.updates];
   
      // Input data example: _data.id _data.updates = {property: 'title', visible: false}
      _state.views = _state.views.map(view => {

        // If the view id matches, find & update the column we need to modify
        if (view.id === _data.id) {
          view.columns.map(column => {

            // Loop over & apply the updates if the column properties match
            _updates.forEach(_update => {
              if (column.property === _update.property) {
                column.visible = _update.visible;
              }
            });
            
            return column;
          });
        }

        return view;
      });

      return _state;

    case SET_ALL_COLUMNS_VISIBLE:
      _state.views = _state.views.map(view => {

        // If the view id matches, select all columns visible
        if (view.id === _data.id) {
          view.columns.map(column => {
            column.visible = true;
      
            return column;
          });
        }

        return view;
      });

      return _state;

    case UNSET_ALL_COLUMNS_VISIBLE:
      _state.views = _state.views.map(view => {

        // If the view id matches, select all columns visible
        if (view.id === _data.id) {
          view.columns.map(column => {
            column.visible = false;
      
            return column;
          });
        }

        return view;
      });

      return _state;

    case RUN_FILTER:
    // Example full filter command
    // {
    //   view : 'eli',
    //   filters: [{
    //     id: 'newtons',
    //     value: ['f144y'],
    //     operator: null
    //   }],
    //   sort: [{property: 'id', operator: 'DESC'}],
    //   pagination: {skip: 1, take: 25}
    // }

      // Update the selectedView with the current filter instructions
      const {queryObject, queryString, filterObject} = makeFilterQueryData({filterObject: _data});
      _state.selectedView = _data.view;
      _state.queryObject = queryObject;
      _state.queryString = queryString;
      _state.filterObject = _data;

      _state.views = _state.views.map(view => {
        if (view.id === _state.selectedView) { // view specific filter runs

          /** FILTERING */
          if (_data.filters) {
            _data.filters.forEach(filterCmd => {
              view.filterGroups.map(group => {
                group.filters.map(filter => {
                  if (filter.id === filterCmd.id) {

                    // All filter values should be an array, for consistency.
                    // We can handle translation on output
                    if (!Array.isArray(filterCmd.value)) {
                      filterCmd.value  = [filterCmd.value];
                    }

                    filter = _merge(filter, filterCmd);
                  }

                  return filter;
                })

                return group;
              })
            });
          }

          /** SORT FILTER */
          if (_data.sort) {
            view.columns.map(column => {
              if (column.id === _data.sort.property) {
                column.sort = _data.sort.operator;
              }

              return column;
            });
          }

          /** PAGINATION FILTER */
          if (_data.pagination) {
            view._pagination = _merge(view._pagination, _data.pagination);
          }
        }

        return view;
      });

      _state.loading = true;

      return _state;

    case RESET_FILTERS:
      _state.views = _state.views.map(view => {

        /** FILTERING */
        view.filterGroups.map(group => {
          group.filters.map(filter => {
            filter['value']  = null;
            filter['operator'] = null;

            return filter;
          });

          return group;
        })

        /** SORT FILTER */
        view.columns.map(column => {
          column['sort'] = null;
          
          return column;
        });

        /** PAGINATION FILTER */
        view['_pagination'] = paginationDefault;

        return view;
      });
     
      _state.loading = true;

      return _state;

    default:
      return _state;
  }
}
