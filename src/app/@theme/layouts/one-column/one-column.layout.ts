import { Component,Input } from "@angular/core";

@Component({
  selector: "ngx-one-column-layout",
  styleUrls: ["./one-column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header class="bg_header" fixed>
        <ngx-header [showMenu]="showMenu"></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" *ngIf="showMenu" tag="menu-sidebar" responsive [compactedBreakpoints]="['md', 'lg']" [collapsedBreakpoints]="['xs', 'is', 'sm']">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  @Input() showMenu:boolean
 }
