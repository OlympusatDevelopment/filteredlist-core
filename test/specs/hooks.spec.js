import { expect, assert } from 'chai';
import Hooks from 'Src/hooks.js';
import {Subject} from 'rxjs';

describe('The Hooks ', () => {
  let hooks;
  let _callbackData;
  let _onFilterChangePayload;
  
  beforeEach(function() {
    hooks = new Hooks();

    _callbackData = {items: []};
    // _onFilterChangePayload = {
    //   filterId: 'role', 
    //   filterValue: ['sdgfkgj2345', 'sdgfkgj2345a', 'sdgfkgj2345f'], 
    //   queryObject: {'users': ['sdgfkgj2345', 'sdgfkgj2345a', 'sdgfkgj2345f']},
    //   callback: data => expect(data).to.eql(_callbackData)
    // };
    _onFilterChangePayload = {
      change: {
        view : 'eli',
        filters: [{
          id: 'newtons',
          value: ['f144y'],
          operator: null
        }],
        sort: [{column: 'id', operator: 'DESC'}],
        pagination: {skip: 1, take: 25}
      },
      state: {},
      lastState: {}
    }
  });

  it('should instantiate', () => expect(hooks).to.be.instanceOf(Hooks));
  it('should be a singleton', () => {
    const hooksInstance = new Hooks();
    hooks.instanceCheck = false;
    hooksInstance.instanceCheck = true;

    // Two checks will doubly ensure a singleton
    expect(hooks.instanceCheck).to.be.true;
    expect(hooks).to.deep.equal(hooksInstance);
  });
  
  it('should have [onFilterChange$] Observable property', () => expect(hooks.onFilterChange$).to.be.instanceOf(Subject));
  it('should have [onFiltersReset$] Observable property', () => expect(hooks.onFiltersReset$).to.be.instanceOf(Subject));
  it('should have [onPaginationChange$] Observable property', () => expect(hooks.onPaginationChange$).to.be.instanceOf(Subject));
  it('should have [onSort$] Observable property', () => expect(hooks.onSort$).to.be.instanceOf(Subject));
  it('should have [_onFilterChange$] Observable property', () => expect(hooks._onFilterChange$).to.be.instanceOf(Subject));
  it('should have [_onFiltersReset$] Observable property', () => expect(hooks._onFiltersReset$).to.be.instanceOf(Subject));
  it('should have [_onPaginationChange$] Observable property', () => expect(hooks._onPaginationChange$).to.be.instanceOf(Subject));
  it('should have [_onSort$] Observable property', () => expect(hooks._onSort$).to.be.instanceOf(Subject));

  it('should have [onWorkspaceItemAdded$] Observable property', () => expect(hooks.onWorkspaceItemAdded$).to.be.instanceOf(Subject));
  it('should have [onWorkspaceItemRemoved$] Observable property', () => expect(hooks.onWorkspaceItemRemoved$).to.be.instanceOf(Subject));
  it('should have [onWorkSpaceCleared$] Observable property', () => expect(hooks.onWorkSpaceCleared$).to.be.instanceOf(Subject));
  it('should have [onLoadingChange$] Observable property', () => expect(hooks.onLoadingChange$).to.be.instanceOf(Subject));
  it('should have [onColumnVisibilityChange$] Observable property', () => expect(hooks.onColumnVisibilityChange$).to.be.instanceOf(Subject));
  it('should have [onSetAllColumnsVisible$] Observable property', () => expect(hooks.onSetAllColumnsVisible$).to.be.instanceOf(Subject));
  it('should have [onUnsetAllColumnsVisible$] Observable property', () => expect(hooks.onUnsetAllColumnsVisible$).to.be.instanceOf(Subject));
  
  it('should have [onDataPushed$] Observable property', () => expect(hooks.onDataPushed$).to.be.instanceOf(Subject));
  it('should have [onQueryStringUpdated$] Observable property', () => expect(hooks.onQueryStringUpdated$).to.be.instanceOf(Subject));
  it('should have [onQueryObjectUpdated$] Observable property', () => expect(hooks.onQueryObjectUpdated$).to.be.instanceOf(Subject));
 
  it('should have [onDataReplaced$] Observable property', () => expect(hooks.onDataReplaced$).to.be.instanceOf(Subject));
  it('should have [onItemUpdated$] Observable property', () => expect(hooks.onItemUpdated$).to.be.instanceOf(Subject));
  it('should have [onItemsCleared$] Observable property', () => expect(hooks.onItemsCleared$).to.be.instanceOf(Subject));
  it('should have [onViewsSet$] Observable property', () => expect(hooks.onViewsSet$).to.be.instanceOf(Subject));
  it('should have [onSelectedViewChange$] Observable property', () => expect(hooks.onSelectedViewChange$).to.be.instanceOf(Subject));
  it('should have [onViewUpdated$] Observable property', () => expect(hooks.onViewUpdated$).to.be.instanceOf(Subject));

  /** Hook Subscription testing */
  function testHook(name) {
    describe(`${name} `, () => {
      it('should forward calls to subscribers', () => {
        hooks[name].subscribe(d => expect(d).to.eql(_onFilterChangePayload));
        hooks[name].next(_onFilterChangePayload);
      });
    
      // it('callback property should be callable from subscriber', () => {
      //   hooks[name].subscribe(d => d.callback(_callbackData));
      //   hooks[name].next(_onFilterChangePayload);
      // });
    });
  }

  testHook('onFilterChange$'); 
  testHook('onFiltersReset$'); 
  testHook('onPaginationChange$');
  testHook('onSort$');
  // testHook('_onFilterChange$'); 
  // testHook('_onFiltersReset$'); 
  // testHook('_onPaginationChange$');
  // testHook('_onSort$');

  testHook('onWorkspaceItemAdded$');
  testHook('onWorkspaceItemRemoved$');
  testHook('onWorkSpaceCleared$');

  testHook('onLoadingChange$');
  testHook('onColumnVisibilityChange$');
  testHook('onSetAllColumnsVisible$');
  testHook('onUnsetAllColumnsVisible$');

  testHook('onDataPushed$');
  testHook('onQueryStringUpdated$');
  testHook('onQueryObjectUpdated$');

  testHook('onDataReplaced$');
  testHook('onItemUpdated$');
  testHook('onItemsCleared$');
  testHook('onViewsSet$');
  testHook('onSelectedViewChange$');
  testHook('onViewUpdated$');
});

