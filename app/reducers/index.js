// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as latex } from '../modules/latex';

const rootReducer = combineReducers({
  router,
  [latex.name]: latex.reducer,
});

export default rootReducer;
