import { Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { Router } from "@angular/router";

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout [showMenu]="allMenuHidden">
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  constructor(private menuService: NbMenuService, private router: Router) { }
  // menu = MENU_ITEMS;
  menu = JSON.parse(JSON.stringify(MENU_ITEMS));
  allMenuHidden = false;

  ngOnInit() {
    this.selectedMenu();
    let userRolePer = JSON.parse(localStorage.getItem("permission"));
    if (userRolePer != '100') {
      let lastMenu = null;
      for (var m of this.menu) {
        if (m.hidden != true) {
          m.hidden = (m.pageId == 0) || (m.pageId == 1) || (!userRolePer) || (userRolePer.length == 0);
          lastMenu = (m.pageId == 0) ? m : lastMenu;
          if ((m.pageId != 0) && userRolePer && userRolePer.length != 0) {
            let page = userRolePer.find(obj => obj.pageId === m.pageId)
            m.hidden = (!page) || (page && !page.isView) || ((m.pageId == 1) && (!page.isCreate));
            lastMenu.hidden = lastMenu.hidden == true && !(page && page.isView)
            if ((page && page.isView) || ((m.pageId == 1) && (page.isCreate))) {
              this.allMenuHidden = true
            }
          }
        }
      }
    } else {
      this.allMenuHidden = true
    }
  }

  selectedMenu() {
    this.menuService.onItemClick().subscribe((data: any) => {
      if (data.item.link == '/pages/business/jrf') {
        let currentUrl = '/pages/business/jrf/njrf';
        this.router.navigateByUrl('/pages', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl],{skipLocationChange: true});
        });
      }
      if (this.menu) {
        this.menu.filter((m) => m.selected === true).map(a => {
          a.selected = false;
        })
      }
      data.item.selected = true;
      if (data.item.pageId) {
        localStorage.setItem('pageId', data.item.pageId)
      }
    });
  }
}
