import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';

export function update_outcome(outcome) {
    return {
        type: CONST.UPDATE_OUTCOMES,
        outcome: outcome
    };
}

export function fetch_outcome(outcome_id) {
    return (dispatch) => {
        return fetch(`http://${config.api.url}:${config.api.port}/sportsbook/outcome/${outcome_id}`)
                .then((response) => response.json(),
                    (error) => {
                        console.log(error);
                        setTimeout(() => { fetch_events(); }, 1500);
                    })
                    .then((json) => {
                        if (json == null)
                            return;

                        console.log(json);

                        for (let outcome in json.outcomes) {
                            for (let entry of json.outcomes[outcome]) {
                                dispatch(update_outcome(entry));
                            }
                        }
                    });
    }
}