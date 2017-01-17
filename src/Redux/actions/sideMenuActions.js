/**
 * handle open / close request for the side menu
 * @param {Boolean} statusToSet
 */
export const setMenuStatus = (statusToSet) => ({
    type: 'SET_MENU_STATUS',
    data: statusToSet
});  
