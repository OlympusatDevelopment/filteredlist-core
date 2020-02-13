import { expect, assert } from 'chai';
import FilteredlistCore from 'Src/index.js';
import Rxdux from 'Src/rxdux';
import optionsExample from 'Src/options.example.js';

import Queries from 'Src/apis/queries';
import Workspace from 'Src/apis/workspace';
import Data from 'Src/apis/data';
import Settings from 'Src/apis/settings';
import Filters from 'Src/apis/filters';
import Hooks from 'Src/hooks';
import mockViews from './mocks/views.mock';
import mockBuiltFilterObj from './mocks/builtFilterObj.mock';

import { __TEST_RUNNER } from 'Src/constants';
import mockQueryObj from './mocks/queryObj.mock';
import mockQueryString from './mocks/queryString.mock';

describe('The filteredlist-core library', () => {
  let fl;
  
  beforeEach(function() {
    fl = new FilteredlistCore(optionsExample);

    // fl.views.setViews(mockViews);
  });

  it('should instantiate', () => expect(fl).to.be.instanceOf(FilteredlistCore));
  it('should instantiate hooks', () => expect(fl.hooks).to.be.instanceOf(Hooks));
  it('should instantiate queries', () => expect(fl.queries).to.be.instanceOf(Queries));
  it('should instantiate workspace', () => expect(fl.workspace).to.be.instanceOf(Workspace));
  it('should instantiate data', () => expect(fl.data).to.be.instanceOf(Data));
  it('should instantiate settings', () => expect(fl.settings).to.be.instanceOf(Settings));
  it('should instantiate filters', () => expect(fl.filters).to.be.instanceOf(Filters));
  it('should instantiate the Rxdux store', () => expect(fl.rxdux).to.be.instanceOf(Rxdux));

  it('should have [_setupReloadListener] method', () => assert.typeOf(fl._setupReloadListener, 'function'));
  it('should have [_setupHistory] method', () => assert.typeOf(fl._setupHistory, 'function'));
  it('should have [_setViews] method', () => assert.typeOf(fl._setViews, 'function'));
  it('should have [_onPageLoad] method', () => assert.typeOf(fl._onPageLoad, 'function'));
  it('should have [_makeGlobal] method', () => assert.typeOf(fl._makeGlobal, 'function'));

  it('should return the options', () => expect(fl.options).to.deep.equal(optionsExample));

  it('should be able to update the Rxdux store', () => {
    fl.rxdux.store$.subscribe(d => {
      if (d.testUpdate) { 
        assert.ok(d.testUpdate, 1234);
      } else {
        expect(d.testUpdate).to.be.undefined;
      }
    });

    fl.rxdux.dispatch({type: __TEST_RUNNER, data: {testUpdate: 1234}});
  });

  it('should expose Hooks methods to the instance prototype', () => 
    Object.keys(new Hooks())
      .forEach(hook => assert.property(fl, hook))
  );

  it('_onPageLoad should update the store with the filterObject, queryObject, queryString, and selectedView', done => {

    fl._onPageLoad()
      .subscribe(state => {
        expect(state.filterObject).to.eql(mockBuiltFilterObj);
        expect(state.queryObject).to.eql(mockQueryObj);
        expect(state.queryString).to.equal(mockQueryString);
        expect(state.selectedView).to.equal('eli');
        done();
      });
  });

  it('_onPageLoad should trigger the onFilterChange$ hook', done => {
    let called = false;

    fl.onFilterChange$.subscribe((data) => {
      if (!called) {
        expect(data).to.have.keys(['change', 'state', 'replaceItems']);
        done(); called = true;
      }
    });

    fl._onPageLoad();
  });

});
