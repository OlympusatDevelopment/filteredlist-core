import { expect, assert } from 'chai';
import QueriesApi from 'Src/apis/queries.js';
import {mergeMap} from 'rxjs/operators';
import Rxdux from 'Src/rxdux';
import optionsExample from 'Src/options.example.js';
import createMemoryHistory from 'history/createMemoryHistory';
import Hooks from 'Src/hooks';
import ViewsApi from 'Src/apis/views';
import mockState from '../mocks/state.mock';
import mockFilterObj from '../mocks/filterObj.mock';
import mockQueryObj from '../mocks/queryObj.mock';
import mockQueryString from '../mocks/queryString.mock';
import mockViews from '../mocks/views.mock';

import {getFilters} from 'Src/utils';

describe('The Queries API ', () => {
  let history, queriesApi, viewsApi;
  const hooks = new Hooks();
  const rxdux = new Rxdux({}, hooks);
  let mockUrl = '/';
  let mockFullUrl = 'https://iliketurtles.com/?state=87fc3814-4cb9-43a5-b723-63ecebd65c5a,cdc3d520-8b74-46ac-9f4c-8f27d04ab49f&view=eli';
  let queryObject = {
    state: ["cbd0a696-2b4f-4469-85d1-f7027345e3e0"],
    genres: ["87fc3814-4cb9-43a5-b723-63ecebd65c5a", "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"],
    languages: ["9d5741e1-b482-4027-8c57-45193073ef12"],
    entityType: ["olyplat-entity-movie"],
    "sort-primaryGenre": "ASC",
  };
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  const _mockBuiltFO = {
    "filters": [
      {
        "id": "newtons",
        "value": [
          "f144y"
        ]
      },
      {
        "id": "state",
        "value": [
          "87fc3814-4cb9-43a5-b723-63ecebd65c5a",
          "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"
        ]
      },
      {
        "id": "languages",
        "value": [
          "9d5741e1-b482-4027-8c57-45193073ef12"
        ]
      }
    ],
    "sort": [
      {
        "property": "id",
        "sort": "ASC"
      }
    ],
    "pagination": {
      "skip": 0,
      "take": 25,
      "page": 1
    },
    "view": "eli"
  };

  beforeEach(function() {
    history = createMemoryHistory();
    queriesApi = new QueriesApi(rxdux, optionsExample, {hooks, history});
    viewsApi = new ViewsApi(rxdux, optionsExample, {hooks});

    viewsApi.setViews(mockViews)
  });

  it('should instantiate', () => expect(queriesApi).to.be.instanceOf(QueriesApi));
  it('should have a history instance', () => assert.ok(queriesApi.history));

  it('should have [_makeQueryObject] method', () => assert.typeOf(queriesApi._makeQueryObject, 'function'));
  it('should have [_makeQueryString] method', () => assert.typeOf(queriesApi._makeQueryString, 'function'));
  it('should have [_writeQueryStringToUrl] method', () => assert.typeOf(queriesApi._writeQueryStringToUrl, 'function'));
  it('should have [_getPaginationQueryParams] method', () => assert.typeOf(queriesApi._getPaginationQueryParams, 'function'));
  it('should have [_getViewParamFromURL] method', () => assert.typeOf(queriesApi._getViewParamFromURL, 'function'));
  it('should have [_pickFromUrl] method', () => assert.typeOf(queriesApi._pickFromUrl, 'function'));
  it('should have [_readQueryStringFromURL] method', () => assert.typeOf(queriesApi._readQueryStringFromURL, 'function'));
  it('should have [_parseParams] method', () => assert.typeOf(queriesApi._parseParams, 'function'));
  it('should have [_makeFilterObjectFromQueryString] method', () => assert.typeOf(queriesApi._makeFilterObjectFromQueryString, 'function'));
  it('should have [_makeFilterQueryData] method', () => assert.typeOf(queriesApi._makeFilterQueryData, 'function'));
  it('should have [_writeFilterQueryDataToStore] method', () => assert.typeOf(queriesApi._writeFilterQueryDataToStore, 'function'));
  it('should have [_writeQueryStringToStore] method', () => assert.typeOf(queriesApi._writeQueryStringToStore, 'function'));
  it('should have [_writeQueryObjectToStore] method', () => assert.typeOf(queriesApi._writeQueryObjectToStore, 'function'));
  it('should have [_writeFilterObjectToStore] method', () => assert.typeOf(queriesApi._writeQueryObjectToStore, 'function'));
  it('should have [getQueryObject] method', () => assert.typeOf(queriesApi.getQueryObject, 'function'));
  it('should have [getQueryString] method', () => assert.typeOf(queriesApi.getQueryString, 'function'));
  it('should have [getFullUrl] method', () => assert.typeOf(queriesApi.getFullUrl, 'function'));
  it('should have [removeQueryStringFromUrl] method', () => assert.typeOf(queriesApi.removeQueryStringFromUrl, 'function'));
  it('should have [_base64] method', () => assert.typeOf(queriesApi._base64, 'function'));
  it('should have [_unBase64] method', () => assert.typeOf(queriesApi._unBase64, 'function'));

  it('_makeQueryObject method should convert a filter object to a query object', done => {
    // Set the view(beforeEach) so we have the correct filters in the store
    const filters = getFilters({view: 'eli', state: mockState});
    const queryObj = queriesApi._makeQueryObject(filters);
 
    expect(queryObj).to.eql(mockQueryObj);
    done();
  });
    
  it('_makeQueryString method should convert a query(filter) object to a query string', () => 
    expect(queriesApi._makeQueryString(mockQueryObj)).to.eql(mockQueryString));

  it('_writeQueryStringToUrl method should modify the history api by writing to the location property', () =>
    expect(queriesApi._writeQueryStringToUrl(mockQueryString, {writeQueryStringToUrl: true}).location.search).to.eql(mockQueryString)); 
  
  it('_writeQueryStringToUrl method should return undefined if options.writeQueryStringToUrl is falsey', () =>
    expect(queriesApi._writeQueryStringToUrl(mockQueryString, {writeQueryStringToUrl: undefined})).to.be.undefined); 
  
  it('_writeQueryStringToUrl method should return undefined if queryString is falsey', () =>
    expect(queriesApi._writeQueryStringToUrl(undefined, {writeQueryStringToUrl: undefined})).to.be.undefined); 
  
  it('_makeFilterObjectFromQueryString method should convert a query object to a query string', () => {
    const _builtFO = queriesApi._makeFilterObjectFromQueryString(mockQueryString);
    expect(_builtFO).to.eql(_mockBuiltFO);
  });

  it('_makeFilterQueryData method should convert a query string, to all the other data types', () => {
    const filterQueryData = queriesApi._makeFilterQueryData({queryString: mockQueryString});
    expect(filterQueryData).to.have.keys(['filterObject', 'queryObject', 'queryString', 'view']);
  });

  it('_makeFilterQueryData method should convert a query object, to all the other data types', () => {
    const filterQueryData = queriesApi._makeFilterQueryData({queryObject: mockQueryObj});
    expect(filterQueryData).to.have.keys(['filterObject', 'queryObject', 'queryString', 'view']);
  });

  it('_makeFilterQueryData method should convert a filter object, to all the other data types', () => {
    const filterQueryData = queriesApi._makeFilterQueryData({filterObject: mockFilterObj});
    expect(filterQueryData).to.have.keys(['filterObject', 'queryObject', 'queryString', 'view']);
  });
  
  it('_writeFilterQueryDataToStore method should update the store with new query data', done => {
    const filterQueryData = queriesApi._makeFilterQueryData({queryObject: mockQueryObj});

    queriesApi._writeFilterQueryDataToStore(filterQueryData)
    const state = rxdux.store$.value;
    assert.equal(state.queryObject, mockQueryObj);
    done();
  });

  it('_writeQueryStringToStore method should update the store with a new query string', done => {
    let called = false;

    queriesApi._writeQueryStringToStore(mockQueryString)
      .subscribe(d => {
        if(!called) {
          assert.equal(d, mockQueryString);

          queriesApi._writeQueryStringToStore('');
          done();called = true;
          called = true;
        }
      }); 
  });

  it('_writeQueryObjectToStore method should update the store with a new query object', done => {
    let called = false;

    queriesApi._writeQueryObjectToStore(queryObject)
      .subscribe(d => {
        if(!called) {
          assert.deepEqual(d, queryObject);

          queriesApi._writeQueryObjectToStore({})
          done();called = true;
          called = true;
        }
      }); 
  });

  it('getQueryObject method should return an Observable that plucks the query object from the current rxdux state', done => {
    let called = false;
    
    queriesApi.getQueryObject()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql({})
          done();called = true;
        }
      });
  });

  it('getQueryString method should return an Observable that plucks the query string from the current rxdux state', done => {
    let called = false;
    
    queriesApi.getQueryString()
      .subscribe(d => {
        if(!called) {
          assert.equal(d, '')
          done();called = true;
        }
      });
  });

  it('getFullUrl method should return a full url', () =>
    assert.equal(queriesApi.getFullUrl(), mockFullUrl));
  
  it('removeQueryStringFromUrl method should remove the query string from the url', () => {
    history.replace(`/${mockQueryString}`);

    assert.equal(queriesApi.removeQueryStringFromUrl(), mockUrl);
  });

  it('_pickFromUrl method should return an object of data picked from the url query string', () => {
    history.replace(mockFullUrl);

    expect(queriesApi._pickFromUrl('state')).to.eql({state: '87fc3814-4cb9-43a5-b723-63ecebd65c5a,cdc3d520-8b74-46ac-9f4c-8f27d04ab49f'});
  });

  it('_getViewParamFromURL method should return an object of view data picked from the url query string', () => {
    history.replace(mockFullUrl);

    assert.equal(queriesApi._getViewParamFromURL(), 'eli');
  });

  it('_base64 method should return a base64 encoded queryString', () => {
    assert.match(queriesApi._base64(mockQueryString), base64Regex); 
  });

  it('_unBase64 method should return the input string', () => {
    const base64QueryStr = queriesApi._base64(mockQueryString);

    assert.equal(queriesApi._unBase64(base64QueryStr), mockQueryString); 
  });

  it('_writeQueryStringToUrl method should write a base64 query to the url if options.base64UrlQueryString is true', () => {
    const historySearchValue = queriesApi._writeQueryStringToUrl(mockQueryString, {writeQueryStringToUrl: true, base64UrlQueryString: true}).location.search;

    assert.equal(historySearchValue, `?fl=${queriesApi._base64(mockQueryString)}`); 
  });
});