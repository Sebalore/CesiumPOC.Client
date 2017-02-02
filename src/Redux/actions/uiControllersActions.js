/**      **********************************************************************      **\
 *      ------------------------------- Nabvar --------------------------------      *
 *\      **********************************************************************      */



/**      **********************************************************************      **\
 *      ------------------------------- Sidebar --------------------------------     *
 *\      **********************************************************************      */

/**
 * @param {Number} index
 */
export const setUpperSelectedIndex = (index) => ({
    type: 'SET_UPPER_SELECTED_INDEX',
    data: index
});

/**
 * @param {Number} index
 */
export const setLowerSelectedIndex = (index) => ({
    type: 'SET_LOWER_SELECTED_INDEX',
    data: index
});

/**
 * handle open / close request for the side menu
 * @param {Boolean} statusToSet
 */
export const setMenuStatus = (statusToSet) => ({
    type: 'SET_MENU_STATUS',
    data: statusToSet
});  