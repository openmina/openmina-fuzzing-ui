import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { Router } from '@angular/router';
import { selectFuzzingActiveDirectory, selectFuzzingDirectories, selectFuzzingUrlType } from '@fuzzing/fuzzing.state';
import { FuzzingGetFileDetails, FuzzingSetActiveDirectory } from '@fuzzing/fuzzing.actions';
import { filter, take } from 'rxjs';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-fuzzing-directories-table',
  templateUrl: './fuzzing-directories-table.component.html',
  styleUrls: ['./fuzzing-directories-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 border-right' },
})
export class FuzzingDirectoriesTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 36;

  readonly tableHeads: TableHeadSorting<FuzzingFile>[] = [
    { name: 'directory' },
  ];

  directories: string[] = [];
  activeDirectory: string;

  private pathFromRoute: string;
  private urlType: string;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToRouteType();
    this.listenToDirectories();
    this.listenToActiveDirectory();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['dir'] && this.directories.length === 0) {
        this.pathFromRoute = route.params['dir'];
      }
    }, take(1));
  }

  private listenToRouteType(): void {
    this.select(selectFuzzingUrlType, (type: 'ocaml' | 'rust') => {
      this.urlType = type;
    });
  }

  private listenToDirectories(): void {
    this.select(selectFuzzingDirectories, (directories: string[]) => {
      this.directories = directories;
      if (this.pathFromRoute) {
        const payload = directories.find(dir => dir === this.pathFromRoute);
        delete this.pathFromRoute;
        if (payload) {
          this.dispatch(FuzzingSetActiveDirectory, payload);
          return;
        }
      } else if (!this.activeDirectory) {
        this.selectDirectory(this.directories[0]);
      }
      this.detect();
    }, filter(d => d.length > 0));
  }

  private listenToActiveDirectory(): void {
    this.select(selectFuzzingActiveDirectory, (directory: string) => {
      this.activeDirectory = directory;
      this.detect();
    }, filter(directory => this.activeDirectory !== directory));
  }

  selectDirectory(dir: string): void {
    if (this.activeDirectory !== dir) {
      this.activeDirectory = dir;
      this.dispatch(FuzzingSetActiveDirectory, dir);
    }
    this.router.navigate([Routes.FUZZING, this.urlType, this.activeDirectory]);
  }
}
