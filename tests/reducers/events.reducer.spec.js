import reducer from '../../src/redux/reducers/events.reducer';
import * as CONST  from '../../src/redux/constants';

describe('The events reducer', () => {
  it('returns an empty array', () => {
    const result = reducer(undefined, {type:'ANYTHING'})
    expect(result.length).toBe(0);
  });
  
  test('adds a new event', () => {
    const action = {type: CONST.ADD_EVENT, event: {eventId: 1, name: 1}};
    const result = reducer(undefined, action);
    expect(result.length).toBe(1);
  });

  test('updates an event', () => {
    const action = {type: CONST.UPDATE_EVENT, event: {eventId: 1, name: 2}};
    const result = reducer(undefined, action);
    expect(result[0].name).toBe(2);
  });
});