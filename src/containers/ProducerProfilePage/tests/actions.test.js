import { fetchProfile } from '../actions';
import { FETCH_PROFILE } from '../constants';

describe('ProducerProfilePage actions', () => {
  describe('fetchProfile', () => {
    it('has a type of FETCH_PROFILE', () => {
      const expected = {
        type: FETCH_PROFILE,
      };
      expect(fetchProfile()).toEqual(expected);
    });
  });
});
