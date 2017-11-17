import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';

import { update_outcome } from './outcomes.action';

export function update_market(market, is_primary = false) {
    market.is_primary = is_primary;

    return {
        type: CONST.UPDATE_MARKET,
        market: market
    };
}

export function fetch_market(market_id) {
    return (dispatch) => {
        return fetch(`http://${config.api.url}:${config.api.port}/sportsbook/market/${market_id}`)
                .then((response) => response.json(),
                    (error) => {
                        console.log(error);
                        setTimeout(() => { fetch_events(); }, 1500);
                    })
                    .then((json) => {
                        if (json == null)
                            return;

                        dispatch(update_market(json.market, true));

                        for (let outcome in json.outcomes) {
                            for (let entry of json.outcomes[outcome]) {
                                dispatch(update_outcome(entry));
                            }
                        }
                    });
    }
}