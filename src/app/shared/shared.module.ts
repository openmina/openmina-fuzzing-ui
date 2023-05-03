import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HorizontalResizeDirective } from './directives/horizontal-resize.directive';
import { HorizontalResizableContainerComponent } from './components/horizontal-resizable-container/horizontal-resizable-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SizePipe } from './pipes/size.pipe';
import { TruncateMidPipe } from './pipes/truncate-mid.pipe';
import { SecDurationPipe } from './pipes/sec-duration.pipe';
import { ThousandPipe } from '@shared/pipes/thousand.pipe';
import { EagerSharedModule } from '@shared/eager-shared.module';
import { ReadableDatePipe } from '@shared/pipes/readable-date.pipe';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';


const COMPONENTS = [
  HorizontalResizableContainerComponent,
];

const DIRECTIVES = [
  HorizontalResizeDirective,
];

const PIPES = [
  SizePipe,
  TruncateMidPipe,
  SecDurationPipe,
  ThousandPipe,
  ReadableDatePipe,
  PluralPipe,
  SafeHtmlPipe,
];

const MODULES = [
  EagerSharedModule,
  ScrollingModule,
  MatExpansionModule,
  ClipboardModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
})
export class SharedModule {}
