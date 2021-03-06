import {map, first, tap, mergeMap} from 'rxjs/operators';
import {
  UPDATE_COLUMN_VISIBILTY,
  SET_ALL_COLUMNS_VISIBLE,
  UNSET_ALL_COLUMNS_VISIBLE,
  UPDATE_PREFERENCES,
  SET_PREFERENCES
} from '../constants';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { of } from 'rxjs';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
    this.hooks = instance.hooks;
    this.options = options;
    this.prefsKey = `${this.options.id}.prefs`;
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
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onColumnVisibilityChange$.next({updates: 'unset-all', views: state.views, state});
      }),
      mergeMap(state => this.getColumnVisibility(id))
    );

    state$
    .pipe(
      untilDestroyed(this, 'destroy')
    )
    .subscribe(()=>{});
    return state$;
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
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onColumnVisibilityChange$.next({updates: 'set-all', views: state.views, state});
        this.hooks.onSetAllColumnsVisible$.next({views: state.views, state});
      }),
      mergeMap(state => this.getColumnVisibility(id))
    );

    state$
    .pipe(
      untilDestroyed(this, 'destroy')
    )
    .subscribe(()=>{});
    return state$;
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
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onColumnVisibilityChange$.next({updates: 'unset-all', views: state.views, state});
        this.hooks.onUnsetAllColumnsVisible$.next({views: state.views, state});
      }),
      mergeMap(state => this.getColumnVisibility(id)),
    );

    state$
    .pipe(untilDestroyed(this, 'destroy'))
    .subscribe(()=>{});
    return state$;
  }

  getPreferences() {
    return this.rxdux.selector$('preferences');
  }

  setPreferences() {
    if (window && window.localStorage) {
      of(window.localStorage.getItem(this.prefsKey))
      .pipe(
        map(data => data ? JSON.parse(data) : {}),
        untilDestroyed(this, 'destroy')
      ).subscribe(preferences => {
        this.rxdux.dispatch({
          type: SET_PREFERENCES,
          data: {preferences}
        }, 'state')
        .pipe(
          first()
        );
      });
    }
  }

  /**
   * Takes a view id and some column settings update data and sends it to the reducer for processing
   *
   * @param {*} id
   * @param {*} updates
   * @returns
   */
  updatePreferences(id, property, settings) {
    const state$ = this.rxdux.dispatch({
      type: UPDATE_PREFERENCES,
      data: {id, property, settings}
    }, 'state')
    .pipe(
      tap(state => {
        // this.hooks.onViewPreferencesUpdated$.next({id, property, settings, state});
        window.localStorage.setItem(this.prefsKey, JSON.stringify(state.preferences));
      })
    );

    state$
    .pipe(
      untilDestroyed(this, 'destroy')
    )
    .subscribe(()=>{});
    return state$;
  }
  
  // Destroy method added for untilDestroy(this, 'destroy')
  destroy(){}
}