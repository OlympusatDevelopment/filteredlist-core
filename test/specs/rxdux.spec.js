import { expect, assert } from 'chai';
import { of } from 'rxjs';
import Rxdux from 'Src/rxdux/index.js';
import optionsExample from 'Src/options.example.js';
import {
  __TEST_RUNNER
} from 'Src/constants';
import initialState from 'Src/rxdux/initialState';

describe('The Rxdux Store', () => {
  let rxdux;

  beforeEach(function() {
    rxdux = new Rxdux();
  });

	it('should instantiate', () => expect(rxdux).to.be.instanceOf(Rxdux));

	it('should be a singleton', () => {
    const rxduxInstance = new Rxdux();
    rxdux.instanceCheck = false;
    rxduxInstance.instanceCheck = true;

    // Two checks will doubly ensure a singleton
    expect(rxdux.instanceCheck).to.be.true;
    expect(rxdux).to.deep.equal(rxduxInstance);
  });

  it('should have [reducer] method', () => assert.typeOf(rxdux.reducer, 'function'));
  it('should have [selector$] method', () => assert.typeOf(rxdux.selector$, 'function'));
  it('should have [dispatch] method', () => assert.typeOf(rxdux.dispatch, 'function'));
  it('should have [reset] method', () => assert.typeOf(rxdux.reset, 'function'));
  
  it('reducer should return a new state', () => {
    expect(rxdux.reducer({}, {type: __TEST_RUNNER, data: {}})).to.eql({})
    expect(rxdux.reducer({}, {type: __TEST_RUNNER, data: {test: true}})).to.eql({test: true})
  });

  it('dispatch method should update rxdux state', done => {
    let called = false;

    rxdux.store$.subscribe(d => {
      if(!called) {
        if (d.testUpdate) { 
          assert.equal(d.testUpdate, 1234); 
        } else {
          expect(d.testUpdate).to.be.undefined;
        }

        done();called = true;
      }
    });

    rxdux.dispatch({type: __TEST_RUNNER, data: {testUpdate: 1234}});
  });

  it('selector$ method should return new selected state ONLY when selected state changes', done => {
    let called = false;

    rxdux.dispatch({type: __TEST_RUNNER, data: {testUpdateDummy: 1111}});
    rxdux.dispatch({type: __TEST_RUNNER, data: {testUpdate: 2121}});
    rxdux.dispatch({type: __TEST_RUNNER, data: {testUpdateDummy: 1010}});

    rxdux.selector$('testUpdate').subscribe(d => {
      if(!called) {
        assert.equal(d, 2121);

        done();called = true;
      } 
    });
  });

  it('reset method should revert the store to initial state', done => {
    let called = false;
    
    rxdux.reset().store$.subscribe(state => {
      if(!called) {
        assert.equal(state, initialState);
        done();called = true;
      } 
    })
  });
});