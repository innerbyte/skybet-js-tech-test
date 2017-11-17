import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';

export function add_outcome(outcome) {
    return {
        type: CONST.ADD_OUTCOMES,
        outcome: outcome
    };
}

export function update_outcome(outcome) {
    return {
        type: CONST.UPDATE_OUTCOMES,
        outcome: outcome
    };
}