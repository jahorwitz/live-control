import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppContainer from './containers/AppContainer';
import { getAllVideos } from './actions/VideoActions';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import reducer from './reducers'

// Thunk allows us to use async functions as actions, instead of plain objects
const store = createStore(reducer, applyMiddleware(thunk));

store.dispatch(getAllVideos());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/" children={<AppContainer />} />
          <Route path="/watch/:id" children={<AppContainer />} />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
