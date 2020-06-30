import { saveProfile } from '../actions';
import { SAVE_PROFILE } from '../constants';

describe('CreateProfilePage actions', () => {
  describe('saveProfile', () => {
    it('has a type of SAVE_PROFILE', () => {
      const expected = {
        type: SAVE_PROFILE,
      };
      expect(saveProfile()).toEqual(expected);
    });
  });
});
