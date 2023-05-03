import { APP_CHANGE_MENU_COLLAPSING, APP_CHANGE_SUB_MENUS, APP_INIT, APP_TOGGLE_MENU_OPENING, APP_TOGGLE_MOBILE } from '@app/app.actions';
import { AppState } from '@app/app.state';


const initialState: AppState = {
  menu: {
    collapsed: JSON.parse(localStorage.getItem('menu_collapsed')) || false,
    isMobile: false,
    open: true,
  },
  subMenus: [],
};

export function reducer(state: AppState = initialState, action: any): AppState {
  switch (action.type) {

    case APP_CHANGE_MENU_COLLAPSING: {
      localStorage.setItem('menu_collapsed', JSON.stringify(action.payload));
      return {
        ...state,
        menu: {
          ...state.menu,
          collapsed: action.payload,
        },
      };
    }

    case APP_CHANGE_SUB_MENUS: {
      return {
        ...state,
        subMenus: action.payload.filter(Boolean),
      };
    }

    case APP_TOGGLE_MOBILE: {
      return {
        ...state,
        menu: {
          ...state.menu,
          isMobile: action.payload.isMobile,
          open: !action.payload.isMobile,
        },
      };
    }

    case APP_TOGGLE_MENU_OPENING: {
      return {
        ...state,
        menu: {
          ...state.menu,
          open: !state.menu.open,
        },
      };
    }

    default:
      return state;
  }
}
