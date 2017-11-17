import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk_middleware from 'redux-thunk';
import { events, settings, markets, outcomes } from './reducers';

const reducer = combineReducers({
    settings,
    events,
    markets,
    outcomes
});

export default createStore(
    reducer,
    applyMiddleware(thunk_middleware)
);