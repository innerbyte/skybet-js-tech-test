import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';

export function add_market(market, is_primary = false) {
    market.is_primary = is_primary;
    
    return {
        type: CONST.ADD_MARKET,
        market: market
    };
}

export function update_market(market) {
    return {
        type: CONST.UPDATE_MARKET,
        market: market
    };
}