import * as CONST from '../constants/';

let initial_state = [];

function slugify(text) {
    if (typeof text === "undefined" || text === null)
        return "";

    const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
    const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return text.toString().trim().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(p, c =>
            b.charAt(a.indexOf(c)))     // Replace special chars
        .replace(/&/g, '-and-')         // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');             // Trim - from end of text
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case CONST.ADD_EVENT:
            action.event.type_name = action.event.linkedEventTypeName || action.event.typeName;
            action.event.cat_name = slugify(action.event.type_name);

            if (state.find(v => v.eventId === action.event.eventId))
                return state.map((v, i, a) => {
                    if (v.eventId === action.event.eventId)
                        return Object.assign({}, v, action.event);
                    else
                        return v;
                });
            else
                return [
                    ...state,
                    action.event
                ];
        case CONST.UPDATE_EVENT:
            let event = state.find((v, i ,a) => {
                return v.eventId === action.event.eventId;
            });

            action.event.type_name = action.event.linkedEventTypeName || action.event.typeName;
            action.event.cat_name = slugify(action.event.type_name);

            if (event)
                return state.map((v, i, a) => {
                    if (v.eventId === action.event.eventId)
                        return Object.assign({}, v, action.event);
                    else
                        return v;
                })
            else
                return [
                  ...state,
                  action.event  
                ];
            break;
        default:
            return state;
    }
};