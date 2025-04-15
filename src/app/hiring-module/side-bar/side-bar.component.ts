import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-asset-manager-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class assetManagerSideBarComponent implements OnInit {

  activeTab: string | null = null;
  isSidebarOpen: boolean = false;

  sidebarItems = [
    {
      label: 'Dashboard',
      route: '/hiring-dashboard',
      matchRoutes: ['/hiring-dashboard', '/rejected','/hold'],
    },
    {
      label: 'Candidate Shortlisted',
      route: '/shortlisted',
    },
    {
      label: 'Interview Scheduling',
      route: '/schedule',
    },
    {
      label: 'Interview Process',
      route: '/process',
    },
    // {
    //   label: 'Processed',
    //   route: '/procesed',
    // },
    {
      label: 'Offer Management',
      route: '/offer-letter',
    },
    {
      label: 'Employee Onboarding',
      route: '/employee-code',
    },
    // {
    //   label: 'Rejected',
    //   route: '/rejected',
    // },
    // {
    //   label: 'Hold',
    //   route: '/hold',
    // },
    // {
    //   label: 'See Job Codes',
    //   route: '/jobcode',
    // },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveTab((event as NavigationEnd).urlAfterRedirects);
      });
  }

  updateActiveTab(url: string): void {
    this.activeTab = url;
  }

  isRouteActive(item: any): boolean {
    if (item.matchRoutes && Array.isArray(item.matchRoutes)) {
      return item.matchRoutes.some(route => this.activeTab?.startsWith(route));
    }
    return this.activeTab?.startsWith(item.route);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
