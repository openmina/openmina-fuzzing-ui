import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { FuzzingClose, FuzzingGetDirectories, FuzzingGetFiles } from '@fuzzing/fuzzing.actions';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { FuzzingFilesTableComponent } from '@fuzzing/fuzzing-files-table/fuzzing-files-table.component';
import { selectFuzzingActiveDirectory, selectFuzzingActiveFile } from '@fuzzing/fuzzing.state';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take, timer } from 'rxjs';
import { removeParamsFromURL } from '@shared/helpers/router.helper';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'mina-fuzzing',
  templateUrl: './fuzzing.component.html',
  styleUrls: ['./fuzzing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row h-100' },
})
export class FuzzingComponent extends StoreDispatcher implements OnInit {

  isActiveRow: boolean;

  private removedClass: boolean;
  private activeDirectory: string;

  @ViewChild('tablesContainer') private tablesContainerRef: ElementRef<HTMLDivElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.dispatch(AppChangeSubMenus, [Routes.OCAML, Routes.RUST]);
    this.listenToRouteChange();
    this.listenToActiveRowChange();
    this.listenToActiveDirectory();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      const urlType = removeParamsFromURL(route.url).split('/')[2] as 'ocaml' | 'rust';
      timer(0, 5000)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.dispatch(FuzzingGetDirectories, { urlType });
          if (this.activeDirectory) {
            this.dispatch(FuzzingGetFiles);
          }
        });
    }, take(1));
  }

  private listenToActiveDirectory(): void {
    this.select(selectFuzzingActiveDirectory, (directory: string) => {
      this.activeDirectory = directory;
    });
  }

  toggleResizing(): void {
    this.tablesContainerRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tablesContainerRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.select(selectFuzzingActiveFile, (row: FuzzingFile) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
        this.detect();
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(FuzzingClose);
  }
}
