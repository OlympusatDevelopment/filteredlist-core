import {map, first, tap, mergeMap} from 'rxjs/operators';
import {
  UPDATE_COLUMN_VISIBILTY,
  SET_ALL_COLUMNS_VISIBLE,
  UNSET_ALL_COLUMNS_VISIBLE
} from '../constants';
import { of } from 'rxjs';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
    this.hooks = instance.hooks;
  }

  /**
   * Returns the column portion of a view object. Reduces the response to 
   * just an array of property ids and visibility booleans.
   * 
   * If viewId is falsey, the first view in the store's list will be used
   *
   * @param {*} viewId
   * @returns
   */
  getColumnVisibility(viewId) {
    return this.rxdux.selector$('views')
      .pipe(map(views => 
        views.filter(view => ((viewId ? view.id === viewId : true)))[0].columns
          .map(column => ({ property: column.property, visible: !!column.visible }))
      )); 
  }

  /**
   * Takes a view id and some column visibility update data and sends it to the reducer for processing
   *
   * @param {*} id
   * @param {*} updates
   * @returns
   */
  setColumnVisibility(id, updates) {
    const state$ = this.rxdux.dispatch({
      type: UPDATE_COLUMN_VISIBILTY,
      data: {id, updates}
    }, 'state');

    return state$
      .pipe(
        first(),
        tap(state => {
          this.hooks.onColumnVisibilityChange$.next({updates: 'unset-all', views: state.views, state});
        }),
        mergeMap(state => this.getColumnVisibility(id))
      )
  }

  /**
   * Select all for a view's column visibility
   *
   * @param {*} id
   * @returns
   */
  setAllVisible(id) {
    const state$ = this.rxdux.dispatch({
      type: SET_ALL_COLUMNS_VISIBLE,
      data: {id}
    }, 'state');

    return state$
      .pipe(
        first(),
        tap(state => {
          this.hooks.onColumnVisibilityChange$.next({updates: 'set-all', views: state.views, state});
          this.hooks.onSetAllColumnsVisible$.next({views: state.views, state});
        }),
        mergeMap(state => this.getColumnVisibility(id))
      )
  }

  /**
   * Desect visible for all columns in a view
   *
   * @param {*} id
   * @returns
   */
  unsetAllVisible(id) {
    const state$ = this.rxdux.dispatch({
      type: UNSET_ALL_COLUMNS_VISIBLE,
      data: {id}
    }, 'state');

    return state$
      .pipe(
        first(),
        tap(state => {
          this.hooks.onColumnVisibilityChange$.next({updates: 'unset-all', views: state.views, state});
          this.hooks.onUnsetAllColumnsVisible$.next({views: state.views, state});
        }),
        mergeMap(state => this.getColumnVisibility(id))
      )
  }
}