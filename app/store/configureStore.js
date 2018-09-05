// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import createSagaMiddleware from 'redux-saga';
import { createHashHistory } from 'history';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

const history = createHashHistory();

const composeEnhancers = process.env.NODE_ENV === 'development' ?
  composeWithDevTools : compose;

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  const store = createStore(
    rootReducer,
    {},
    composeEnhancers(
      applyMiddleware(
        ...middleware,
      ),
    ),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

export { configureStore, history };
