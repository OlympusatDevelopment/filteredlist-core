import { expect, assert } from 'chai';
import DataApi from 'Src/apis/data.js';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import Hooks from 'Src/hooks';
import {mockEmptyItems, mockItemsArray, mockItemsArrayKeyed, mockReplaceItemsArray} from '../mocks/items.mock';
import mockViews from '../mocks/views.mock';

describe('The Data API ', () => {
  let dataApi, viewsApi;
  const hooks = new Hooks();
  const rxdux = new Rxdux({}, hooks);

  beforeEach(function() {
    viewsApi = new ViewsApi(rxdux, optionsExample, {hooks});
    dataApi = new DataApi(rxdux, optionsExample, {hooks});

    viewsApi.setViews(mockViews)
  });

  it('should instantiate', () => expect(dataApi).to.be.instanceOf(DataApi));
  it('should have [_transformCollectionToKeyValue] method', () => assert.typeOf(dataApi._transformCollectionToKeyValue, 'function'));
  it('should have [getItems] method', () => assert.typeOf(dataApi.getItems, 'function'));
  it('should have [getItemById] method', () => assert.typeOf(dataApi.getItemById, 'function'));
  it('should have [pushItems] method', () => assert.typeOf(dataApi.pushItems, 'function'));
  it('should have [replaceItems] method', () => assert.typeOf(dataApi.replaceItems, 'function'));
  it('should have [updateItem] method', () => assert.typeOf(dataApi.updateItem, 'function'));
  it('should have [clearItems] method', () => assert.typeOf(dataApi.clearItems, 'function'));

  it('_transformCollectionToKeyValue method should convert array items to key value entries', (done) => {   
    assert.deepEqual(dataApi._transformCollectionToKeyValue(mockItemsArray, 'id'), mockItemsArrayKeyed);
    done();
  });

  it('getItems method should return an Observable that plucks the items from the current rxdux state', (done) => {   
    let called = false;
    
    dataApi.getItems()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockEmptyItems);
          done();called = true;
        }
      }); 
  });

  it('pushItems method should Add items to the items registry in the store', (done) => {   
    let called = false;
    
    dataApi.pushItems({items: mockItemsArray, idProp: 'id', totalItems: 300})
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockItemsArray);
          done();called = true;
        }
      }); 
  });

  it('replaceItems method should replace all items in the store\'s item registry', (done) => {   
    let called = false;
    
    dataApi.replaceItems({items: mockReplaceItemsArray, idProp: 'id', totalItems: 300})
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockReplaceItemsArray);
          done();called = true;
        }
      }); 
  });

  it('replaceItems method should replace items and update the selected view\'s pagination object', (done) => {   
    let called = false;
    
    dataApi.replaceItems({items: mockReplaceItemsArray, idProp: 'id', totalItems: 100}, 'state')
      .subscribe(state => {
        if(!called) {            
          const pagination = state.views.filter(view => view.id === state.selectedView)[0]._pagination;

          expect(pagination.totalItems).to.equal(100);
          done();called = true;
        }
      }); 
  });

  it('updateItem method should update the one item in the store', (done) => {   
    let called = false;
    let _mockItems = [
      {id: 34, name: 'EliFishies'},
      {id: 246, name: 'Tigers'},
      {id: 314, name: 'Eli'}
    ];

    dataApi.updateItem({id: 34, name: 'EliFishies'}, 'id')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(_mockItems);
          done();called = true;
        }
      }); 
  });

  it('getItemById method should return the one item in the store', (done) => {   
    let called = false;

    dataApi.getItemById('34')
      .subscribe(d => {
        if(!called) {

          // result relies on the updateItem test to have run first to poulate the store with expected data
          expect(d).to.eql({id: 34, name: 'EliFishies'}); 
          done();called = true;
        }
      }); 
  });

  it('clearItems method should clear all items in the stores item registry', (done) => {   
    let called = false;
    
    dataApi.clearItems()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([]);
          done();called = true;
        }
      }); 
  });
});