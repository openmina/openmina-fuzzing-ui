import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromErrorPreview from '@error-preview/error-preview.reducer';
import { ErrorPreviewAction } from '@error-preview/error-preview.actions';
import { ErrorPreviewState } from '@error-preview/error-preview.state';

import * as fromApp from '@app/app.reducer';
import { AppAction } from '@app/app.actions';
import { AppState } from '@app/app.state';

import * as fromFuzzing from '@fuzzing/fuzzing.reducer';
import { FuzzingAction } from '@fuzzing/fuzzing.actions';
import { FuzzingState } from '@fuzzing/fuzzing.state';
import { routerReducer } from '@ngrx/router-store';
import { MergedRouteReducerState } from '@shared/router/merged-route';


export interface MinaState {
  app: AppState;
  error: ErrorPreviewState;
  fuzzing: FuzzingState;
  router: MergedRouteReducerState;
}

type MinaAction =
  & AppAction
  & ErrorPreviewAction
  & FuzzingAction
  ;

export const reducers: ActionReducerMap<MinaState, MinaAction> = {
  app: fromApp.reducer,
  error: fromErrorPreview.reducer,
  fuzzing: fromFuzzing.reducer,
  router: routerReducer,
};

export const metaReducers: MetaReducer<MinaState, MinaAction>[] = [];

export const selectMinaState = (state: MinaState): MinaState => state;
