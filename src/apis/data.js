import {reduce, mergeMap, map, pluck, first, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {
  PUSH_ITEMS_TO_STORE,
  REPLACE_ITEMS,
  CLEAR_ITEMS,
  UPDATE_ITEM,
  REPLACE_SELECTED_ITEMS,
  CLEAR_SELECTED_ITEMS
} from '../constants';
import { untilDestroyed } from 'ngx-take-until-destroy';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
    this.hooks = instance.hooks;
  }

  /**
   *Converts collection to a key value registry on the prop optionally sepecifiied
   *
   * @param {*} collection
   * @param {string} [idProp='id']
   * @returns
   */
  _transformCollectionToKeyValue(collection, idProp = 'id') {
    return collection.reduce((acc, curr) => {
      acc[curr[idProp]] = curr;

      return acc;
    }, {});
  }

  /**
   * Returns an Observable of the items in the store$.
   * Output transforms the key value stored data back to an array.
   * @returns
   */
  getItems() {
    return this.rxdux.selector$('items')
      .pipe(map((item) => Object.keys(item).map(k => item[k])),
      untilDestroyed(this, 'destroy'));
  }

  /**
   * Returns an observable of the item in the store
   *
   * @param {*} id
   * @returns
   */
  getItemById(id) {
    return this.rxdux.selector$('items')
      .pipe(pluck(id), untilDestroyed(this, 'destroy'));
  }

  /**
   * Pushes items into the store
   *
   * @param {*} items
   * @param {*} idProp
   * @param {*} totalItems
   * @returns
   */
  pushItems({items, idProp = 'id', totalItems}, selector) {
    const state$ = this.rxdux.dispatch({
      type: PUSH_ITEMS_TO_STORE,
      data: {
        items: this._transformCollectionToKeyValue(Array.isArray(items) ? items : [items], idProp),
        totalItems
      }
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onDataPushed$.next({items: state.items, state, totalItems});
        this.hooks.onLoadingChange$.next({loading: false, state});
      }),
      mergeMap((state) => selector == 'state' ? of(state) : this.getItems()),
      untilDestroyed(this, 'destroy')
    );
    
    state$.subscribe(()=>{});
    return state$;

  }

  /**
   * Replaces items in the store
   *
   * @param {*} items
   * @param {*} idProp
   * @returns
   */
  replaceItems({items = [], idProp = 'id', totalItems = 5}, selector) {
    const state$ = this.rxdux.dispatch({
      type: REPLACE_ITEMS,
      data: {
        items: Array.isArray(items) ? items : [items],
        //TODO: What was the purpose of this method.
        // items: this._transformCollectionToKeyValue(Array.isArray(items) ? items : [items], idProp),
        totalItems
      }
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onDataReplaced$.next({items: state.items, state, totalItems});
        this.hooks.onLoadingChange$.next({loading: false, state});
      }),
      mergeMap((state) => selector == 'state' ? of(state)  : this.getItems()),
      untilDestroyed(this, 'destroy')
    );

    state$.subscribe(() => {});
    return state$;
  }

  /**
   * Updates an item in the store
   *
   * @param {*} item
   * @param {*} idProp
   * @returns
   */
  updateItem(item, idProp = 'id', selector) {
    const state$ = this.rxdux.dispatch({
      type: UPDATE_ITEM,
      data: {id: item[idProp], item}
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onItemUpdated$.next({item, items: state.items, state, totalItems});
        this.hooks.onLoadingChange$.next({loading: false, state});
      }),
      mergeMap((state) => selector == 'state' ? of(state)  : this.getItems()),
      untilDestroyed(this, 'destroy')
    );

    state$.subscribe(()=>{});
    return state$
  }

  /**
   * Clears all items in the store
   *
   * @returns
   */
  clearItems() {
    const state$ = this.rxdux.dispatch({
      type: CLEAR_ITEMS
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onItemsCleared$.next({items: state.items, state});
      }),
      mergeMap(() => this.getItems()),
      untilDestroyed(this, 'destroy')
    );

    state$.subscribe(()=>{});
    return state$
  }

  /**
   * Replaces selectedItems in the store
   *
   * @param {*} item
   * @param {*} idProp
   * @returns
   */
  replaceSelectedItems({selectedItems}, selector) {
    const state$ = this.rxdux.dispatch({
      type: REPLACE_SELECTED_ITEMS,
      data: {selectedItems: selectedItems}
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onItemsSelected$.next({selectedItems: state.selectedItems, state});
      }),
      mergeMap((state) => selector == 'state' ? of(state)  : this.getItems()),
      untilDestroyed(this, 'destroy')
    );

    state$.subscribe(()=>{});
    return state$
  }

  /**
   * Clears all selectedItems in the store
   *
   * @returns
   */
  clearSelectedItems(selector) {
    const state$ = this.rxdux.dispatch({
      type: CLEAR_SELECTED_ITEMS
    }, 'state')
    .pipe(
      first(),
      tap(state => {
        this.hooks.onItemsSelected$.next({selectedItems: [], state});
      }),
      mergeMap((state) => selector == 'state' ? of(state)  : this.getItems()),
      untilDestroyed(this, 'destroy')
    );

    state$.subscribe(()=>{});
    return state$
  }

  // Destroy method added for untilDestroy(this, 'destroy')
  destroy(){}
}