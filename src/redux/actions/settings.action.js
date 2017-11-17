import * as CONST from '../constants';
import fetch from 'isomorphic-fetch';
import config from '../../config';

export function update_settings(settings) {
    return {
        type: CONST.UPDATE_SETTINGS,
        settings: settings
    };
}

export function fetch_settings() {
    return {
        type: CONST.FETCH_SETTINGS
    };
}