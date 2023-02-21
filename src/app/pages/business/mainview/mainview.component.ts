import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-main-view',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss']
})
export class mainViewComponent {

  jrfHiddenId = 0
  jrfObj = {}
  protected tabs: any[] = [
    {
      title: 'Job Request Form',
      route: 'njrf',
      responsive: true,
      skipLocationChange: true,
      icon: 'shopping-bag',
    }
  ];

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.jrfId) {
      this.tabs.push({
        title: 'Documents',
        route: 'jdoc',
        skipLocationChange: true,
        responsive: true,
        icon: 'attach'
      },
        {
          title: 'Visitor Pass',
          route: 'jvis',
          skipLocationChange: true,
          responsive: true,
          icon: 'car'
        }
      )
      this.jrfHiddenId = this.router.getCurrentNavigation().extras.state.jrfId
      this.jrfObj=this.router.getCurrentNavigation().extras.state.jrfDtl
    }
  }


}
