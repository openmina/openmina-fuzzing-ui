import { ErrorHandler, Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { THEME_PROVIDER } from '@core/services/theme-switcher.service';
import { EagerSharedModule } from '@shared/eager-shared.module';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { metaReducers, reducers } from '@app/app.setup';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppEffects } from '@app/app.effects';
import { ErrorPreviewComponent } from '@error-preview/error-preview.component';
import { ErrorListComponent } from '@error-preview/error-list/error-list.component';
import { NgrxRouterStoreModule } from '@shared/router/ngrx-router.module';
import { CONFIG } from '@shared/constants/config';
import { GlobalErrorHandlerService } from '@core/services/global-error-handler.service';
import { SubmenuTabsComponent } from '@app/layout/submenu-tabs/submenu-tabs.component';

@Injectable()
export class AppGlobalErrorhandler implements ErrorHandler {
  constructor(private errorHandlerService: GlobalErrorHandlerService) {}

  handleError(error: any) {
    this.errorHandlerService.handleError(error);
    console.error(error);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ErrorPreviewComponent,
    ErrorListComponent,
    SubmenuTabsComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true,
      },
    }),
    EffectsModule.forRoot([AppEffects]),
    NgrxRouterStoreModule,
    !CONFIG.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    HttpClientModule,
    BrowserAnimationsModule,
    EagerSharedModule,
  ],
  providers: [
    THEME_PROVIDER,
    { provide: ErrorHandler, useClass: AppGlobalErrorhandler, deps: [GlobalErrorHandlerService] },
    { provide: LOCALE_ID, useValue: 'en' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
