import { expect, assert } from 'chai';
import {of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import WorkspaceApi from 'Src/apis/workspace.js';
import optionsExample from 'Src/options.example.js';
import Rxdux from 'Src/rxdux';
import { of } from 'rxjs';
import Hooks from 'Src/hooks';

describe('The Workspace API ', () => {
  let workspaceApi, workspace$;
  const hooks = new Hooks();
  const rxdux = new Rxdux({}, hooks);
  const mockEmptyWorkspace = {items:{}};
  const mockItem = {id: 1234, name: 'someone'};

  beforeEach(function() {
    workspaceApi = new WorkspaceApi(rxdux, optionsExample, {hooks});
  });

  it('should instantiate', () => expect(workspaceApi).to.be.instanceOf(WorkspaceApi));
  
  it('should have [getWorkspace] method', () => assert.typeOf(workspaceApi.getWorkspace, 'function'));
  it('should have [addItemToWorkspace] method', () => assert.typeOf(workspaceApi.addItemToWorkspace, 'function'));
  it('should have [removeItemFromWorkspace] method', () => assert.typeOf(workspaceApi.removeItemFromWorkspace, 'function'));
  it('should have [clearWorkspace] method', () => assert.typeOf(workspaceApi.clearWorkspace, 'function'));

  it('getWorkspace method should return an Observable that plucks the workspace from the current rxdux state', (done) => {   
    let called = false;
    
    workspaceApi.getWorkspace()
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql(mockEmptyWorkspace);
          done();called = true;
        }
      }); 
  });

  it('addItemToWorkspace method should return the workspace with an item added', done => {
    let called = false;
    
    workspaceApi.addItemToWorkspace(mockItem, 'id')
      .subscribe(d => {
        if(!called) {
          expect(d).to.eql({items: {[mockItem.id]: mockItem}});
          done();called = true;
        }
      }); 
  });

  it('removeItemFromWorkspace method should return the workspace with an item removed after having been added', done => {
    let called = false;
    let called1 = false;
    
    workspaceApi.addItemToWorkspace(mockItem, 'id')
      .pipe(mergeMap(d => {
        if(!called) {
          expect(d).to.eql({items: {[mockItem.id]: mockItem}});
          called = true;
      
          return workspaceApi.removeItemFromWorkspace(mockItem.id);
        }

        return of({});
      }))
      .subscribe(c => {
        if(!called1) {
          expect(c).to.eql({items: {}});
         
          done();called1 = true;
        }
      });
  });

  it('clearWorkspace method should add an item then clear the workspace', done => {
    let called = false;
    let called1 = false;
    
    workspaceApi.addItemToWorkspace(mockItem, 'id')
      .pipe(mergeMap(d => {
        if(!called) {
          expect(d).to.eql({items: {[mockItem.id]: mockItem}});
          called = true;
      
          return workspaceApi.clearWorkspace();
        }

        return of({});
      }))
      .subscribe(c => {
        if(!called1) {
          expect(c).to.eql({items: {}});
         
          done();called1 = true;
        }
      });
  });

});
