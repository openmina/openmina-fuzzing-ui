import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectAppMenu } from '@app/app.state';
import { TooltipService } from '@shared/services/tooltip.service';
import { LoadingService } from '@core/services/loading.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { LoadingEvent } from '@shared/types/core/loading/loading-event.type';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { APP_TOGGLE_MENU_OPENING, AppToggleMenuOpening } from '@app/app.actions';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { CONFIG } from '@shared/constants/config';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'mina-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center border-bottom' },
})
export class ToolbarComponent extends ManualDetection implements OnInit {

  menu: AppMenu;
  title: string;
  definiteLoading: LoadingEvent;
  isMobile: boolean;
  currentTheme: ThemeType;
  readonly appIdentifier: string = CONFIG.identifier;

  @ViewChild('loadingRef') private loadingRef: ElementRef<HTMLDivElement>;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private router: Router,
              private store: Store<MinaState>,
              private loadingService: LoadingService,
              private tooltipService: TooltipService) { super(); }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') as ThemeType;
    this.listenToTitleChange();
    this.listenToMenuChange();
    this.listenToLoading();
  }

  private listenToLoading(): void {
    const displayNone: string = 'd-none';
    const classList = this.loadingRef.nativeElement.classList;

    this.loadingService.countSub$
      .pipe(delay(0))
      .subscribe((count: number) => {
        if (count > 0) {
          classList.remove(displayNone);
        } else {
          classList.add(displayNone);
        }
      });

    this.loadingService.progressLoadingSub$
      .pipe(delay(0))
      .subscribe((event: LoadingEvent) => {
        this.definiteLoading = event;
        if (event.percentage === 100) {
          this.loadingService.progressLoadingSub$.next({ percentage: 0 });
          return;
        } else if (event.percentage === 0) {
          this.definiteLoading = null;
        }
        this.detect();
      });
  }

  private listenToMenuChange(): void {
    this.store.select(selectAppMenu)
      .pipe(filter(menu => menu.isMobile !== this.isMobile))
      .subscribe((menu: AppMenu) => {
        this.menu = menu;
        this.isMobile = menu.isMobile;
        this.detect();
      });
  }

  private listenToTitleChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          while (route!.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data[Object.getOwnPropertySymbols(route.snapshot.data)[0]];
        }),
      )
      .subscribe((title: string) => {
        if (title) {
          this.title = title.split('- ')[1];
          this.detect();
        }
      });
  }

  changeTheme(): void {
    const theme: ThemeType = this.document.body.classList.contains(ThemeType.LIGHT) ? ThemeType.DARK : ThemeType.LIGHT;
    this.currentTheme = theme;
    const transitionToken: string = 'theme-transition';

    this.document.body.classList.add(transitionToken);
    this.document.body.classList.remove(ThemeType.DARK, ThemeType.LIGHT);
    this.document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
    setTimeout(() => this.document.body.classList.remove(transitionToken), 700);
  }

  toggleTooltips(): void {
    this.tooltipService.toggleTooltips();
  }
}
