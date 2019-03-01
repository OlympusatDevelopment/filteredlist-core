import {
  ADD_ITEM_TO_WORKSPACE,
  REMOVE_ITEM_FROM_WORKSPACE,
  CLEAR_WORKSPACE
} from '../constants';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
    this.namespace = 'workspace';
  }

  /**
   * Retrieve the current workspace from the store$
   * Because workspace items are in a key value store, we can use the key to 
   * just reference the actual item in the items collection, so we don't rely on potentially stale data.
   * The full item is on the value of the workspace items key in case we want stale data after all.
   *
   * @returns
   */
  getWorkspace() {
    return this.rxdux.selector$(this.namespace);
  }

  /**
   * Adds an item reference to the workspace in the store$
   *
   * @returns
   */
  addItemToWorkspace(item, idProp = 'id') {
    return this.rxdux.dispatch({
      type: ADD_ITEM_TO_WORKSPACE,
      data: {id: item[idProp], item}
    }, this.namespace);
  }

  /** 
   * Pulls an item out of the workspace by id
   * 
   * @returns
   * */
  removeItemFromWorkspace(id) {
    return this.rxdux.dispatch({
      type: REMOVE_ITEM_FROM_WORKSPACE,
      data: {id}
    }, this.namespace);
  }

  /**
   * Removes all data from the internal workspace
   *
   * @returns
   */
  clearWorkspace() {
    return this.rxdux.dispatch({
      type: CLEAR_WORKSPACE
    }, this.namespace);
  }
}