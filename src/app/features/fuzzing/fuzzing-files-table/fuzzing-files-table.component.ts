import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Router } from '@angular/router';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import {
  selectFuzzingActiveDirectory,
  selectFuzzingActiveFile,
  selectFuzzingFiles,
  selectFuzzingFilesSorting,
  selectFuzzingUrlType,
} from '@fuzzing/fuzzing.state';
import { FuzzingGetFileDetails, FuzzingSort } from '@fuzzing/fuzzing.actions';
import { filter, take, timer } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { untilDestroyed } from '@ngneat/until-destroy';
import { FuzzingDirectory } from '@shared/types/fuzzing/fuzzing-directory.type';

@Component({
  selector: 'mina-fuzzing-files-table',
  templateUrl: './fuzzing-files-table.component.html',
  styleUrls: ['./fuzzing-files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class FuzzingFilesTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 36;

  readonly tableHeads: TableHeadSorting<FuzzingFile>[] = [
    { name: 'coverage' },
    { name: 'path' },
  ];

  files: FuzzingFile[] = [];
  activeFile: FuzzingFile;
  currentSort: TableSort<FuzzingFile>;

  @ViewChild(CdkVirtualScrollViewport, { static: true }) private scrollViewport: CdkVirtualScrollViewport;
  private pathFromRoute: string;
  private urlType: string;
  private activeDirectory: FuzzingDirectory;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToSortingChanges();
    this.listenToFiles();
    this.listenToActiveFile();
    this.listenToActiveDirectory();
    this.listenToRouteType();

    timer(0, 5000)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.activeFile) {
          this.dispatch(FuzzingGetFileDetails, this.activeFile);
        }
      });
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['file'] && this.files.length === 0) {
        this.pathFromRoute = route.params['file'];
      }
    }, take(1));
  }

  private listenToRouteType(): void {
    this.select(selectFuzzingUrlType, (type: 'ocaml' | 'rust') => {
      this.urlType = type;
    });
  }

  private listenToFiles(): void {
    this.select(selectFuzzingFiles, (files: FuzzingFile[]) => {
      this.files = files;
      if (files.length > 0 && this.pathFromRoute) {
        const payload = files.find(file => file.path === this.pathFromRoute);
        if (payload) {
          this.dispatch(FuzzingGetFileDetails, payload);
          this.detect();
          this.scrollToElement();
          delete this.pathFromRoute;
          return;
        }
      }
      this.detect();
    });
  }

  private listenToActiveFile(): void {
    this.select(selectFuzzingActiveFile, (file: FuzzingFile) => {
      this.activeFile = file;
      this.detect();
    }, filter(file => this.activeFile !== file));
  }

  private listenToActiveDirectory(): void {
    this.select(selectFuzzingActiveDirectory, (directory: FuzzingDirectory) => {
      this.activeDirectory = directory;
    }, filter(directory => this.activeDirectory !== directory));
  }

  private listenToSortingChanges(): void {
    this.select(selectFuzzingFilesSorting, sort => {
      this.currentSort = sort;
      this.detect();
    });
  }

  private scrollToElement(): void {
    if (!this.pathFromRoute) {
      return;
    }
    const topElements = Math.floor(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize);
    const index = this.files.findIndex(file => file.path === this.pathFromRoute) - topElements;
    this.scrollViewport.scrollToIndex(index);
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(FuzzingSort, { sortBy: sortBy as keyof FuzzingFile, sortDirection });
  }

  onRowClick(file: FuzzingFile): void {
    if (this.activeFile?.path !== file.path) {
      this.activeFile = file;
      this.dispatch(FuzzingGetFileDetails, file);
    }
    this.router.navigate([Routes.FUZZING, this.urlType, this.activeDirectory.fullName, file.path]);
  }
}
