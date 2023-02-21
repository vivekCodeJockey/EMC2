import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  hideMenuOnClick: boolean = false;
  user: any;
  userAcc: any;
  color: string;
  @Input() showMenu: boolean;

  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";

  userMenu = [
    {
      title: "Profile",
      icon: "people",
      link: "/pages/user/userProfile",
      tooltips: "Profile",
      skipLocationChange: true,
      hidden: false,
    },
    {
      title: "",
      icon: "people",
      tooltips: "Profile",
      cls: "test",
      hidden: true,
    },
    {
      title: "Help",
      icon: "question-mark-circle",
      tooltips: "Help",
      hidden: true,
    },
    { title: "Log out", icon: "log-out", tooltips: "Log out" },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.color = "#fff";
    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === "Log out") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("accesToken");
        localStorage.removeItem("refreshToken");
        // this.router.navigate(['auth']).then(() => {
        this.router.navigate([""]).then(() => {});
      }
    });
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => {
        this.userAcc = JSON.parse(localStorage.getItem("userInfo"));
        this.user = this.userAcc.userDetailsEntity;
        if ((!this.user)||(!(this.user && this.user['firstName']))) {
          this.user={};
          this.user.name = this.userAcc.username;
          this.userMenu[1].title = this.user.name + "\n" + this.userAcc.email;
          this.userMenu[1].hidden = false;
          this.userMenu[0].hidden = true;
        }else{
          this.user.name = this.user.firstName + " " + this.user.lastName;
        }
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe((isLessThanXl: boolean) => {
        this.userPictureOnly = isLessThanXl;
        this.toggleSidebar();
        this.hideMenuOnClick = isLessThanXl;
      });

    this.menuService.onItemClick().subscribe(() => {
      if (this.hideMenuOnClick) {
        this.sidebarService.compact("menu-sidebar");
      }
    });

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    // this.menuService.navigateHome();
    this.router.navigate(["pages/business/mytask"], {
      skipLocationChange: true,
    });
    return false;
  }
}
