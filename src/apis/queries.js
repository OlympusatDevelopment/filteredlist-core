import mockQueryString from '../../test/specs/mocks/queryString.mock';
import {
  UPDATE_QUERY_STRING,
  UPDATE_QUERY_OBJECT,
  UPDATE_FILTER_OBJECT
} from '../constants';
import {first, tap, filter} from 'rxjs/operators';
import _merge from 'lodash.merge';
import { untilDestroyed } from 'ngx-take-until-destroy';

export default class{
  constructor(rxdux, options, instance) {
    this.rxdux = rxdux;
    this.hooks = instance.hooks;
    this.views = instance.views;
    this._isPhantomHistory = instance._isPhantomHistory;
    this.history = instance.history;

  }

  /**
   * Makes the query object to be translated according to output type specification
   * @param filters
   * @returns {*}
   * @private
   */
  _makeQueryObject(filterObject) {
    return makeQueryObject(filterObject);
  }

  /**
   * Returns the query parameter based on state.filters
   * @param queryObject
   */
  _makeQueryString(queryObject) {
    return makeQueryString(queryObject);
  }

  /**
   *Updates the query String stored in the store$
   *
   * @param {*} queryString
   * @returns
   */
  _writeQueryStringToStore(queryString) {
    const queryString$ = this.rxdux.dispatch({
        type: UPDATE_QUERY_STRING,
        data: {queryString}
      }, 'queryString')
      .pipe(
        first(),
        tap(queryString => {
          this.hooks.onQueryStringUpdated$.next({queryString});
        }),
        untilDestroyed(this, 'destroy')
      );

    queryString$.subscribe(() => {});
    return queryString$;
  }

  /**
   *Updates the query object stored in the store$
   *
   * @param {*} queryObject
   * @returns
   */
  _writeQueryObjectToStore(queryObject) {
    const queryObject$ = this.rxdux.dispatch({
        type: UPDATE_QUERY_OBJECT,
        data: {queryObject}
      }, 'queryObject')
      .pipe(
        first(),
        tap(queryObject => {
          this.hooks.onQueryObjectUpdated$.next({queryObject});
        }),
        untilDestroyed(this, 'destroy')
      );

      queryObject$.subscribe(() => {});
      return queryObject$;
  }

  /**
   * Updates the store with a new filterObject entry
   *
   * @param {*} filterObject
   * @returns
   */
  _writeFilterObjectToStore(filterObject) {
    const filterObject$ = this.rxdux.dispatch({
        type: UPDATE_FILTER_OBJECT,
        data: {filterObject}
      }, 'filterObject')
      .pipe(
        first(),
        tap(filterObject => {
          console.log('nexting filter Object', filterObject);
          this.hooks.onFilterObjectUpdated$.next({filterObject});
        }),
        untilDestroyed(this, 'destroy')
      );

      filterObject$.subscribe(() => {console.log('onFilterObjectChanged')});
      return filterObject$;
  }

  /**
 * Writes the query string to the url
 * @param queryString
 * @param options
 * @private
 */
  _writeQueryStringToUrl(queryString, options) {
    // Only allow if the config file specifies
    if (options.writeQueryStringToUrl 
        && (queryString || queryString === null) 
        && this.history.search !== queryString
    ) {
      // const path = this.history.location.href.split('?')[0].split(this.history.location.host)[1];
      const path = this.history.location.pathname;

      if (queryString === null) { queryString = ''; }

      // let replaceUrl = (queryString + '&' + this._getPaginationQueryParams()).replace(/&+$/, "");
      let replaceUrl = queryString;

      // Legacy support for clearPaginationQueryString
      if (options.clearPaginationQueryString) {
        replaceUrl = queryString;
      }

      // Write via base64
      if (options.base64UrlQueryString) {
        replaceUrl = `fl=${this._base64(replaceUrl)}`;
      }

      /**
      * @todo Need to rewrite all url interactions to use the history api only. Replace not just the path, but the search params too
      * history.push('/home', { some: 'state' }) 
      * https://www.npmjs.com/package/history
      */
      this.history.push({search: replaceUrl}); // replace triggers a pop and the page loads, push triggers pushState and the url updates but doesn't reload the page

      return this.history;
    }
  }

  /**
   * Gets the pagination query params from the url to preserve them on write
   */
  _getPaginationQueryParams() {
    // const params = _.pick(this.parseParms(this.readQueryStringFromURL()), ['skip', 'take', 'page']);
    const params = this._pickFromUrl(['skip', 'take', 'page']);
    let str = '';

    // @todo convert this to a reducer
    for (let key in params) {
      str += `${key}=${params[key]}&`
    }

    return str.slice(0, -1);// removes the last ampersand
    //return params;
  }

  /**
   * Fetches the current view from the url
   * @returns {string}
   */
  _getViewParamFromURL() {
    // const params = _.pick(parseParms(readQueryStringFromURL()), ['view']);
    const params = this._pickFromUrl(['view']);
    let str = '';

    for (let key in params) {
      str += `${key}=${params[key]}&`
    }

    return this._parseParams(str.slice(0, -1)).view;
  }

  /**
   *Utility for picking properties form the query string
   * @returns
   */
  _pickFromUrl(props = []) {
    const _props = Array.isArray(props) ? props : [props];
    return Object.entries(this._parseParams(this._readQueryStringFromURL()))
      .reduce((acc, [k, v]) => {
        if (_props.includes(k)) {
          acc[k] = v;
        }
        return acc;
      }, {});
  }

  /**
   * From: http://stackoverflow.com/questions/23481979/function-to-convert-url-hash-parameters-into-object-key-value-pairs
   * @param str
   * @returns {{}}
   */
  _parseParams(str = '') {
    var pieces = str.replace('?', '').split("&"), data = {}, i, parts;
    // process each query pair
    for (i = 0; i < pieces.length; i++) {
      parts = pieces[i].split("=");
      if (parts.length < 2) {
        parts.push("");
      }
      data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return data;
  }

  /**
   * Reads the query string from a url
   */
  _readQueryStringFromURL() {
    // return this.history.location.href.split('?')[1] || '';
    return this._isPhantomHistory 
      ? mockQueryString
      : this.history.location.search;
  }

    /**
   * Converts a query string to a query object. Used on app load to rebuild a filter set
   * @param str
   */
  _makeFilterObjectFromQueryString(str = '') {
    return makeFilterObjectFromQueryString(str);
  }


  /**
   * Utility for batch making all the necessary data types from a single variable input
   *
   * @param {*} {filterObject, queryObject, queryString}
   * @returns
   */
  _makeFilterQueryData({filterObject, queryObject, queryString}) {
    return makeFilterQueryData({filterObject, queryObject, queryString});
  }

  /**
   * Batch write filterQuery data to the store
   *
   * @param {*} filterQueryData
   */
  _writeFilterQueryDataToStore({filterObject, queryObject, queryString}) {
    this._writeQueryStringToStore(queryString);
    this._writeQueryObjectToStore(queryObject);
    this._writeFilterObjectToStore(filterObject);
  }

  /**
  * Converts a query String to a base 64 query.
  * Supports browser and node environments
   *
   */
  _base64(inputString) {
    let _btoa;
    try{ _btoa = btoa; }
    catch(e) {
      _btoa = str => Buffer.from(str).toString('base64');
    }

    return _btoa(inputString);
  }

  /**
   * Converts a base 64 string to a human readable string.
   * Supports node env
   *
   * @returns
   */
  _unBase64(inputBase64Str) {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if(!inputBase64Str.match(base64Regex)) {
      throw new Error('queries.js[_unBase64QueryString] | Invalid base64 string provided.');
    }

    let _atob;
    try{ _atob = btoa; }
    catch(e) {
      _atob = str => Buffer.from(str, 'base64').toString();
    }

    return _atob(inputBase64Str);
  }

  /**
   * Plucks the filterObject from the current state
   *
   * @returns
   */
  getFilterObject(){
    return this.rxdux.selector$('filterObject');  
  }

  /**
   * Plucks the queryObject from the current state
   *
   * @returns
   */
  getQueryObject(){
    return this.rxdux.selector$('queryObject');  
  }

    /**
   * Plucks the queryString from the current state
   *
   * @returns
   */
  getQueryString(){
    return this.rxdux.selector$('queryString');
  }

  /**
   * If we're running in a browser, return the full url, else return a dummy
   * @returns
   */
  getFullUrl() {
    try{
      return window.location.href;
    } catch(e){
      return 'https://iliketurtles.com/?state=87fc3814-4cb9-43a5-b723-63ecebd65c5a,cdc3d520-8b74-46ac-9f4c-8f27d04ab49f&view=eli';
    }
  }

  /**
   * Remove the query string fromt he url
   *
   */
  removeQueryStringFromUrl() {
    this.history.push(this.history.location.pathname);

    return `${this.history.location.pathname}${this.history.location.search}`;
  }

  // Destroy method added for untilDestroy(this, 'destroy')
  destroy(){}
}

  /**
   * Makes the query object to be translated according to output type specification
   * @param filters
   * @returns {*}
   * @private
   */
  export function makeQueryObject({filters, sort, pagination, view}, options = null) {
    const _filters = filters.reduce((acc, {id, value}) => {
      let key = id;
      // let value = filter[key];
      // Input can now be a filter object generated from state, or generated from a query string. They have 2 different structures
      // if (filter.hasOwnProperty('id') && filter.hasOwnProperty('value') ) {
      //   key = filter.id;
      //   value = filter.value;
      // }

      const isSortKey = key.indexOf('sort-') > -1;
      const paginationKeys = ['skip', 'take', 'page', 'cursor'];

      if (isSortKey) { return acc; }
      if (paginationKeys.includes(key)) { return acc; }

      // Check if the property to filter on exists already;
      // Then check if it's an array.
      // make it an array and push the value
      if (acc.hasOwnProperty(key)) {
        if (Array.isArray(acc[key])) {
          acc[key].push(value);// Add the new value
        } else {
          acc[key] = [acc[key]];// Extract the string value and transform to an array
          acc[key].push(value);//Add the new value
        }
      } else {
        acc[key] = value;// First run, add the string
      }
      // return the mutated object
      return acc;
    }, {});

    const _sort = sort
      .reduce((acc, curr) => {
        acc[`sort-${curr.property}`] = curr.sort;
        return acc;
      }, {});

      let _pagination = {
        /*TODO: Get default pagination object from config
        to set queryObject pagination if empty
        */
        skip: Number(pagination.skip || 0),
        take: Number(pagination.take || 25),
        page: Number(pagination.page || 1)
      };

      if (typeof pagination.cursor !== 'undefined') {
        _pagination.cursor = pagination.cursor;
      }

      return {..._filters, ..._sort, ..._pagination, view};
  };

  /**
   * Returns the query parameter based on state.filters
   * @param queryObject
   */
  export function makeQueryString(queryObject) {

    // MErge everything, then covnert merged array to an object
    // Remove anything with a null value
    // Handles single values and range values 
    Object.keys(queryObject)
      .forEach((key) => (queryObject[key] == null
        || ((queryObject[key].hasOwnProperty('start') && queryObject[key].hasOwnProperty('end'))
          && (queryObject[key].start == null && queryObject[key].end == null)))
        && delete queryObject[key]);

      let queryString = Object.keys(queryObject)
        .map(k => {
          let attribute = k,
            value = queryObject[k],
            tmp_query = '';

          if (value.hasOwnProperty('start') && value.hasOwnProperty('end')) {
            tmp_query = `${attribute}--start=${value.start}&${attribute}--end=${value.end}`;
          } else {
            tmp_query = `${attribute}=${value}`;
          }

          return tmp_query;
        })
        .reduce((sum, query) => {

          //Handle missing &
          if (query.charAt(0) !== '&') {
            query = '&' + query;
          }

          // Combine query strings
          return sum + query;
        }, '');

    // Handle the ? character at the beginning of the string
    if (queryString.charAt(0) === '&') {
      queryString = queryString.replace(/^&/, '?');
    } else if (queryString.charAt(0) !== '&' || queryString.charAt(0) !== '?') {
      queryString = '?' + queryString;
    }

    return queryString;
  };

  /**
   * Converter for strings to filter objects
   *
   * @export
   * @param {*} str
   * @returns
   */
  export function makeFilterObjectFromQueryString(str){
    const obj = decodeURI(str.replace(/^\?/, ''))
      .split("&")
      .reduce((acc, segment) => {
        // segment: genre=1234nksfngkw45w45
        if (!segment)
          return acc;

        const _segment = segment.split('='); // ['genre','1234nksfngkw45w45']
        const key = _segment[0];
        const value = _segment[1].split(',');

        // Build pagination object
        if (key === 'view') {
          
          acc.view = value[0];
        } else if (['skip', 'take', 'page', 'cursor'].includes(key)) {
          
          acc.pagination[key] = Number(value[0]); // un arrayify pagination values
        } else if (key.indexOf('sort-') > -1) {
          
          acc.sort.push({
            property: key.replace('sort-', ''), 
            sort: value[0]
          });
        } else {
          
          acc.filters.push({
            id: key, 
            value
          });
        }

        return acc;
      }, {
        filters: [],
        sort: [],
        pagination: {},
        view: ''
      });
      return obj;
  }

  /**
   * Helper for building filter query data objects
   *
   * @export
   * @param {*} {filterObject, queryObject, queryString}
   * @returns
   */
  export function makeFilterQueryData({filterObject, queryObject, queryString}) {
    let _filterObject = {}; 
    let _queryObject = {}; 
    let _queryString = '';

    // First we need to get a query Object
    if (queryString) {

      _queryString = queryString;
      _filterObject = makeFilterObjectFromQueryString(_queryString);
      _queryObject = makeQueryObject(_filterObject);
    } else if (filterObject) {

      _filterObject = filterObject;
      _queryObject = makeQueryObject(_filterObject);
      _queryString = makeQueryString(_queryObject);

    } else if (queryObject) {

      _queryObject = queryObject;
      _queryString = makeQueryString(_queryObject);
      _filterObject = makeFilterObjectFromQueryString(_queryString);
    }
    
    return {
      filterObject : _filterObject, 
      queryObject: _queryObject, 
      queryString: _queryString, 
      view: _filterObject.view
    }
  }
