import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';
import { update_market } from './markets.action';
import { update_outcome } from './outcomes.action';

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

                        for (let event of json.events) {
                            dispatch(update_event(event));
                        }

                        for (let market in json.markets) {
                            for (let entry of json.markets[market]) {
                                dispatch(update_market(entry, true));
                            }
                        }

                        for (let outcome in json.outcomes) {
                            for (let entry of json.outcomes[outcome]) {
                                dispatch(update_outcome(entry));
                            }
                        }
                    });
    }
}

export function fetch_event(event_id) {
    return (dispatch) => {
        return fetch(`http://${config.api.url}:${config.api.port}/sportsbook/event/${event_id}`)
                .then((response) => response.json(),
                    (error) => {
                        console.log(error);
                        setTimeout(() => { fetch_events(); }, 1500);
                    })
                    .then((json) => {
                        if (json == null)
                            return;

                        dispatch(update_event(json.event));

                        for (let market in json.markets) {
                            for (let entry of json.markets[market]) {
                                dispatch(update_market(entry, true));
                            }
                        }

                        for (let outcome in json.outcomes) {
                            for (let entry of json.outcomes[outcome]) {
                                dispatch(update_outcome(entry));
                            }
                        }
                    });
    }
}