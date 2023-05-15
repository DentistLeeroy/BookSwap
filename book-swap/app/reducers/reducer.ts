import { combineReducers } from 'redux';
import userProfileReducer from './userProfile';

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
});

export default rootReducer;