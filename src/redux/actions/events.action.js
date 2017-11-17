import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';
import { add_market } from './markets.action';
import { add_outcome } from './outcomes.action';

export function add_event(event) {
    return {
        type: CONST.ADD_EVENT,
        event: event
    };
}

export function update_event(event) {
    return {
        type: CONST.UPDATE_EVENT,
        event: event
    };
}

export function fetch_events() {
    return (dispatch) => {
        return fetch(`http://${config.api.url}:${config.api.port}/football/live?primaryMarkets=true`)
                .then((response) => response.json(),
                    (error) => {
                        console.log(error);
                        setTimeout(() => { fetch_events(); }, 1500);
                    })
                    .then((json) => {
                        if (json == null)
                            return;

                        console.log(json);

                        for (let event of json.events) {
                            dispatch(add_event(event));
                        }

                        for (let market in json.markets) {
                            for (let entry of json.markets[market]) {
                                dispatch(add_market(entry, true));
                            }
                        }

                        for (let outcome in json.outcomes) {
                            for (let entry of json.outcomes[outcome]) {
                                dispatch(add_outcome(entry));
                            }
                        }
                    });
    }
}