// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import packet from './packet';

const rootReducer = combineReducers({
  counter,
  packet,
  router,
});

export default rootReducer;
