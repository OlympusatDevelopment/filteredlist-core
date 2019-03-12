import { expect, assert } from 'chai';
import SettingsApi from 'Src/apis/settings.js';
import ViewsApi from 'Src/apis/views.js';
import optionsExample from 'Src/options.example.js';
import {of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import Rxdux from 'Src/rxdux';
import Hooks from 'Src/hooks';
import { of } from 'rxjs';
import Hooks from 'Src/hooks';

describe('The Settings API ', () => {
  let settingsApi, viewsApi;
  const hooks = new Hooks();
  const rxdux = new Rxdux({}, hooks);
  const mockViews = [
    {id: 'eli', columns:[{property: 'id'}, {property: 'title', visible: true}]},
    {id: 'eliWithGlasses', columns:[{property: 'id'}, {property: 'title', visible: true}]},
    {id: 'eliWithAPegLeg', columns:[{property: 'id'}, {property: 'title', visible: false}, {property: 'genre', visible: true}]}
  ];

  beforeEach(function() {
    viewsApi = new ViewsApi(rxdux, optionsExample, {hooks});
    settingsApi = new SettingsApi(rxdux, optionsExample, {hooks});

    viewsApi.setViews(mockViews)
  });

  it('should instantiate', () => expect(settingsApi).to.be.instanceOf(SettingsApi));
  
  it('should have [getColumnVisibility] method', () => assert.typeOf(settingsApi.getColumnVisibility, 'function'));
  it('should have [setColumnVisibility] method', () => assert.typeOf(settingsApi.setColumnVisibility, 'function'));
  it('should have [setAllVisible] method', () => assert.typeOf(settingsApi.setAllVisible, 'function'));
  it('should have [unsetAllVisible] method', () => assert.typeOf(settingsApi.unsetAllVisible, 'function'));

  it('getColumnVisibility method should return the columns and their visible from a view', (done) => {   
    let called = false;
    
    settingsApi.getColumnVisibility('eliWithAPegLeg')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([
            {property: 'id', visible: false}, 
            {property: 'title', visible: false}, 
            {property: 'genre', visible: true}
          ]);
          done();called = true;
        } 
      }); 
  });

  it('setColumnVisibility method should update a view\'s column visibility, then return that column collection', (done) => {   
    let called = false;
    
    settingsApi.setColumnVisibility('eli', {property: 'title', visible: false})
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([
            {property: 'id', visible: false}, {property: 'title', visible: false}
          ]);
          done();called = true;
        } 
      }); 
  });

  it('setColumnVisibility method should accept an array of update values as well as a single update', (done) => {   
    let called = false;
    
    settingsApi.setColumnVisibility('eli', [{property: 'id', visible: true}, {property: 'title', visible: true}])
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([
            {property: 'id', visible: true}, {property: 'title', visible: true}
          ]);
          done();called = true;
        } 
      }); 
  });

  it('unsetAllVisible method should unset all columns visible in a view, then return the view\'s columns', (done) => {   
    let called = false;
    
    settingsApi.unsetAllVisible('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([
            {property: 'id', visible: false}, {property: 'title', visible: false}
          ]);
          done();called = true;
        } 
      }); 
  });

  it('setAllVisible method should set all columns visible in a view, then return the view\'s columns', (done) => {   
    let called = false;
    
    settingsApi.setAllVisible('eli')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql([
            {property: 'id', visible: true}, {property: 'title', visible: true}
          ]);
          done();called = true;
        } 
      }); 
  });

});