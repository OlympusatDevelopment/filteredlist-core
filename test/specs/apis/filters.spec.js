import { expect, assert } from 'chai';
import FiltersApi from 'Src/apis/filters.js';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import Hooks from 'Src/hooks';
import ViewsApi from 'Src/apis/views';
import Queries from 'Src/apis/queries';
import DataApi from 'Src/apis/data';
import createMemoryHistory from 'history/createMemoryHistory';
import mockViews from '../mocks/views.mock';
import {mockEmptyItems, mockItemsArray, mockItemsArrayKeyed, mockReplaceItemsArray} from '../mocks/items.mock';

describe('The Filters API ', () => {
  let filtersApi, viewsApi, dataApi, queries, history;
  const hooks = new Hooks();
  const rxdux = new Rxdux(optionsExample, hooks);
  const views = new ViewsApi(rxdux, optionsExample, {hooks});

  const exampleFilterRun = {
    view : 'eli',
    filters: [
      {
        id: 'newtons',
        value: ['f144y'],
        operator: null
      },
      {
        id: 'state',
        value: ["87fc3814-4cb9-43a5-b723-63ecebd65c5a", "cdc3d520-8b74-46ac-9f4c-8f27d04ab49f"],
        operator: 'AND'
      },
      {
        id: 'languages',
        value: ["9d5741e1-b482-4027-8c57-45193073ef12"],
        operator: 'OR'
      },
    ],
    sort: [{column: 'id', operator: 'DESC'}],
    pagination: {skip: 0, take: 25}
  };
 

  beforeEach(function() {
    history = createMemoryHistory();
    queries = new Queries(rxdux, optionsExample, {hooks, history});
    viewsApi = new ViewsApi(rxdux, optionsExample, {hooks});
    dataApi = new DataApi(rxdux, optionsExample, {hooks});
    filtersApi = new FiltersApi(rxdux, optionsExample, {hooks, queries, data: dataApi, views});
 
    viewsApi.setViews(mockViews)
  });

  it('should instantiate', () => expect(filtersApi).to.be.instanceOf(FiltersApi));

  it('should have [getFilters] method', () => assert.typeOf(filtersApi.getFilters, 'function'));
  it('should have [getSortFilters] method', () => assert.typeOf(filtersApi.getSortFilters, 'function'));
  it('should have [getPaginationFilters] method', () => assert.typeOf(filtersApi.getPaginationFilters, 'function'));
  it('should have [run] method', () => assert.typeOf(filtersApi.run, 'function'));
  it('should have [resetFilters] method', () => assert.typeOf(filtersApi.resetFilters, 'function'));
  it('should have [activateProxyHookSubscriptions] method', () => assert.typeOf(filtersApi.activateProxyHookSubscriptions, 'function'));

  it('getFilters method should return an Observable that plucks the filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getFilters({view: 'eli', filterGroup: 'figNewtons'})
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['filters', 'sort', 'pagination', 'view']);
          done();called = true;
        }
      }); 
  });

  it('getSortFilters method should return an Observable that plucks the sort filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getSortFilters('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([ 
            { property: 'id', sort: 'ASC' },
            { property: 'title', sort: null } 
          ]);
          done();called = true;
        }
      }); 
  });

  it('getPaginationFilters method should return an Observable that plucks the filters from the current rxdux state', (done) => {   
    let called = false;
    
    filtersApi.getPaginationFilters('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql({cursor: null, page: 1, skip: 0, take: 25, totalItems: 100});// total 100 is set by the data.spec file
          done();called = true;
        }
      }); 
  });

  it('run method should add a filter command to the store, then return an Observable that plucks the filters from the current rxdux state', done => {   
    let called = false;
    assert.ok(filtersApi.run(exampleFilterRun));
    
    filtersApi.getFilters({view: 'eli', filterGroup: 'figNewtons'})
      .subscribe(d => {
        if(!called) {
          expect(d.filters[0].value).to.have.members(['f144y']);
          done();called = true;
        }
      });
  });

  it('run method should trigger the onFilterChange$ hook to fire', done => {   
    let called = false;
    
    hooks.onFilterChange$
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['change', 'state', 'replaceItems']);
          done();called = true;
        }
      });

      assert.ok(filtersApi.run(exampleFilterRun));
  });

  it('run method should trigger the onPaginationChange$ hook to fire', done => {   
    let called = false;
    
    hooks.onPaginationChange$
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['change', 'state', 'replaceItems']);
          done();called = true;
        }
      });

      assert.ok(filtersApi.run(exampleFilterRun));
  });

  it('run method should trigger the onSort$ hook to fire', done => {   
    let called = false;
    
    hooks.onSort$
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['change', 'state', 'replaceItems']);
          done();called = true;
        }
      });

      assert.ok(filtersApi.run(exampleFilterRun));
  });

  it('run method should trigger the onFilterChange$ hook to fire, and it should allow us to set store items from its callback', done => {   
    let called = false;
    
    hooks.onFilterChange$
      .subscribe(({change, state, replaceItems}) => {
        if(!called) {

          replaceItems({items: mockItemsArray, idProp: 'id', totalItems: 300});
          
          // Now we can check the store to see if our items match
          dataApi.getItems()
            .subscribe(d => {
              if(!called) {
                expect(d).to.eql(mockItemsArray);
                done();called = true;
              }
            }); 
        }
      });

      assert.ok(filtersApi.run(exampleFilterRun));
  });

  it('resetFilters method should clear all filter values in the store, then return an Observable that plucks the filters from the current rxdux state', done => {   
    let called = false;
    assert.ok(filtersApi.run(exampleFilterRun));
    assert.ok(filtersApi.resetFilters());
    
    filtersApi.getFilters({view: 'eli', filterGroup: 'figNewtons'})
      .subscribe(d => {
        if(!called) {
          assert.isNull(d.filters[0].value);
          assert.isNull(d.filters[0].operator);

          done();called = true;
        }
      });
  });

  it('resetFilters method should trigger the onFiltersReset$ hook to fire', done => {   
    let called = false;

    hooks.onFiltersReset$
      .subscribe(d => {
        if(!called) {
          expect(d).to.have.keys(['change', 'state', 'replaceItems']);
          done();called = true;
        }
      });

      assert.ok(filtersApi.resetFilters());
  });
});