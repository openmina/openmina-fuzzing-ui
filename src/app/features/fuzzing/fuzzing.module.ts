import { NgModule } from '@angular/core';

import { FuzzingComponent } from './fuzzing.component';
import { FuzzingFilesTableComponent } from './fuzzing-files-table/fuzzing-files-table.component';
import { FuzzingCodeComponent } from './fuzzing-code/fuzzing-code.component';
import { FuzzingRouting } from '@fuzzing/fuzzing.routing';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { FuzzingEffects } from '@fuzzing/fuzzing.effects';
import { FuzzingToolbarComponent } from './fuzzing-toolbar/fuzzing-toolbar.component';
import { FuzzingDirectoriesTableComponent } from './fuzzing-directories-table/fuzzing-directories-table.component';


@NgModule({
  declarations: [
    FuzzingComponent,
    FuzzingFilesTableComponent,
    FuzzingCodeComponent,
    FuzzingToolbarComponent,
    FuzzingDirectoriesTableComponent,
  ],
  imports: [
    SharedModule,
    FuzzingRouting,
    EffectsModule.forFeature([FuzzingEffects]),
  ],
})
export class FuzzingModule {}
