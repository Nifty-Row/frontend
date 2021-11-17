import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { MainService } from './core/services/main.service';

import { AppController } from './app.controller';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends AppController implements OnInit {
  navButtons: any;
  headerInfo: any;
  footerInfo: any;
  showHeader: any;

  constructor(private router: Router,
              private route: ActivatedRoute,  private spinner: NgxSpinnerService,
              private titleService: Title, public mainService: MainService) {
    super();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.route.firstChild.snapshot.data.showHeader;
      }
    });
    this.mainService.getLanding().subscribe(res => {
      
    });
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.mainService.getHeader().subscribe(res => {
      this.headerInfo = res;
    })
    this.mainService.getFooter().subscribe(res => {
      this.footerInfo = res;
    })
    // this.spinner.show();
    this.setBrowserTabTitle();
    this.mainService.fetchArtWorkFromMain(1, 10);
    this.mainService.fetchBlogPost();
    // this.spinner.hide();
  }

  private setBrowserTabTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => this.getRouteFirstChild(route)),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
    ).subscribe(event => this.titleService.setTitle(this.buildTitle(event['title'])));
  }

  private getRouteFirstChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  private buildTitle(pageTitle: string): string {
    if (pageTitle && pageTitle !== this.trans.home) {
      return [pageTitle, this.config.appTitle].join(this.config.browserTabTitleDelimiter);
    }

    return this.config.appTitle;
  }

}
