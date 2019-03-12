import { expect, assert } from 'chai';
import * as utils from 'Src/utils';
import mockState from './mocks/state.mock';
import mockFilterObj from './mocks/filterObj.mock';

describe('The Utility File', () => {
  const view = 'eli';
  const filterGroup = null;

  it('should have [getFilters] method', () => assert.typeOf(utils.getFilters, 'function'));
  
  it('getFilters should return a filter object with sort, pagination, and filtering, given a state object', () => {
    const filterObj = utils.getFilters({view, filterGroup, state: mockState});

    expect(filterObj).to.eql(mockFilterObj);
  });

});