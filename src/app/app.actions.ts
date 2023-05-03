import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Routes } from '@shared/enums/routes.enum';

enum AppActionTypes {
  APP_INIT = 'APP_INIT',
  APP_CHANGE_MENU_COLLAPSING = 'APP_CHANGE_MENU_COLLAPSING',
  APP_CHANGE_SUB_MENUS = 'APP_CHANGE_SUB_MENUS',
  APP_TOGGLE_MOBILE = 'APP_TOGGLE_MOBILE',
  APP_TOGGLE_MENU_OPENING = 'APP_TOGGLE_MENU_OPENING',
}

export const APP_INIT = AppActionTypes.APP_INIT;
export const APP_CHANGE_MENU_COLLAPSING = AppActionTypes.APP_CHANGE_MENU_COLLAPSING;
export const APP_CHANGE_SUB_MENUS = AppActionTypes.APP_CHANGE_SUB_MENUS;
export const APP_TOGGLE_MOBILE = AppActionTypes.APP_TOGGLE_MOBILE;
export const APP_TOGGLE_MENU_OPENING = AppActionTypes.APP_TOGGLE_MENU_OPENING;

export interface AppAction extends FeatureAction<AppActionTypes> {
  readonly type: AppActionTypes;
}

export class AppInit implements AppAction {
  readonly type = APP_INIT;
}

export class AppChangeMenuCollapsing implements AppAction {
  readonly type = APP_CHANGE_MENU_COLLAPSING;

  constructor(public payload: boolean) { }
}

export class AppChangeSubMenus implements AppAction {
  readonly type = APP_CHANGE_SUB_MENUS;

  constructor(public payload: Routes[]) {}
}

export class AppToggleMobile implements AppAction {
  readonly type = APP_TOGGLE_MOBILE;

  constructor(public payload: { isMobile: boolean }) { }
}

export class AppToggleMenuOpening implements AppAction {
  readonly type = APP_TOGGLE_MENU_OPENING;
}

export type AppActions =
  | AppInit
  | AppChangeMenuCollapsing
  | AppChangeSubMenus
  | AppToggleMobile
  | AppToggleMenuOpening
  ;
