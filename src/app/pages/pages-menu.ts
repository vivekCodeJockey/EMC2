import { Params, QueryParamsHandling } from '@angular/router';
import { NbIconConfig, NbMenuItem } from '@nebular/theme';
import { NbMenuBadgeConfig } from '@nebular/theme/components/menu/menu.service';

export class menu implements NbMenuItem {
  title: string;
  link?: string;
  url?: string;
  icon?: string | NbIconConfig;
  expanded?: boolean;
  badge?: NbMenuBadgeConfig;
  children?: menu[];
  target?: string;
  hidden?: boolean;
  pathMatch?: 'full' | 'prefix';
  home?: boolean;
  group?: boolean;
  skipLocationChange?: boolean;
  queryParams?: Params;
  queryParamsHandling?: QueryParamsHandling;
  parent?: NbMenuItem;
  selected?: boolean;
  data?: any;
  fragment?: string;
  preserveFragment?: boolean;
  pageId: number;
}

export const MENU_ITEMS: menu[] = [
  {
    title: 'Bussiness',
    group: true,
    pageId: 0,
  },
  {
    //file-text
    title: 'Job Tracker', icon: 'briefcase',
    link: '/pages/business/mytask',
    pageId: 10,
    pathMatch:'full',
    selected:true,
    skipLocationChange: true,
    home: true,
  },
  // {
  //   title: 'Dashboard',
  //   icon: 'home-outline',  
  //   link: '/pages/dashboard',
  //   hidden: true,
  //   pageId: 0,
  // },
  {
    title: 'Job Request Form', icon: 'edit-2',
    link: '/pages/business/jrf',
    pathMatch:'prefix',
    skipLocationChange: true,
    pageId: 1
  },
  {
    title: 'Quotation', icon: 'shopping-cart-outline',
    link: '/pages/business/quotation',
    skipLocationChange: true,
    pageId: 2,
    hidden: true,
  },
  {
    title: 'Visitor Pass', icon: "book",
    link: '/pages/business/visitorPass',
    skipLocationChange: true,
    hidden: true,
    pageId: 8
  },
   {
    title: 'Operation',
    group: true,
    hidden: true,
    pageId: 0,
  }, {
    title: 'Slot Allocation', icon: "book",
    link: '/pages/business/slot',
    skipLocationChange: true,
    hidden: true,
    pageId: 7
  },
  {
    title: 'Tester Allocation', icon: "book",
    link: '/pages/business/engineerAllocate',
    skipLocationChange: true,
    hidden: true,
    pageId: 9
  },
  {
    title: 'Work Sheet', icon: "book",
    link: '/pages/business/worksheet',
    skipLocationChange: true,
    hidden: true,
    pageId: 11
  },
  {
    title: 'Generate Report', icon: "book",
    link: '/pages/business/generateReport',
    skipLocationChange: true,
    hidden: true,
    pageId: 12
  },
  {
    title: 'Document Upload', icon: "book",
    link: '/pages/business/documnetUpload',
    skipLocationChange: true,
    hidden: true,
    pageId: 13
  },
  {
    title: 'Master',
    group: true,
    pageId: 0,
  }, {
    title: 'Tariff', icon: 'pricetags',
    link: '/pages/business/TariffMst',
    skipLocationChange: true,
    pathMatch:'full',
    pageId: 4
  }, {
    title: 'Standard', icon: "book",
    link: '/pages/business/StandardMst',
    skipLocationChange: true,
    pathMatch:'full',
    pageId: 5
  }, 
  {
    title: 'Equipment', icon: "pantone",
    link: '/pages/business/Equipment',
    skipLocationChange: true,
    pathMatch:'full',
    pageId: 6
  }, 
  {
    title: 'Admin',
    group: true,
    pageId: 0,
  },
  {
    title: 'Role', icon: 'shield',
    link: '/pages/user/role',
    pathMatch:'full',
    skipLocationChange: true,
    pageId: 3
  },
  {
    title: 'Add User', icon: 'person-add',
    link: '/pages/user/assign',
    pathMatch:'full',
    skipLocationChange: true,
    pageId: 14
  },
  {
    title: 'Customer Approval', icon: 'person-done',
    link: '/pages/user/approve',
    pathMatch:'full',
    skipLocationChange: true,
    pageId: 15
  }
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Layout',
  //   icon: 'layout-outline',
  //   children: [
  //     {
  //       title: 'Stepper',
  //       link: '/pages/layout/stepper',
  //     },
  //     {
  //       title: 'List',
  //       link: '/pages/layout/list',
  //     },
  //     {
  //       title: 'Infinite List',
  //       link: '/pages/layout/infinite-list',
  //     },
  //     {
  //       title: 'Accordion',
  //       link: '/pages/layout/accordion',
  //     },
  //     {
  //       title: 'Tabs',
  //       pathMatch: 'prefix',
  //       link: '/pages/layout/tabs',
  //     },
  //   ],
  // },
  // {
  //   title: 'Forms',
  //   icon: 'edit-2-outline',
  //   children: [
  //     {
  //       title: 'Form Inputs',
  //       link: '/pages/forms/inputs',
  //     },
  //     {
  //       title: 'Form Layouts',
  //       link: '/pages/forms/layouts',
  //     },
  //     {
  //       title: 'Buttons',
  //       link: '/pages/forms/buttons',
  //     },
  //     {
  //       title: 'Datepicker',
  //       link: '/pages/forms/datepicker',
  //     },
  //   ],
  // },
  // {
  //   title: 'UI Features',
  //   icon: 'keypad-outline',
  //   link: '/pages/ui-features',
  //   children: [
  //     {
  //       title: 'Grid',
  //       link: '/pages/ui-features/grid',
  //     },
  //     {
  //       title: 'Icons',
  //       link: '/pages/ui-features/icons',
  //     },
  //     {
  //       title: 'Typography',
  //       link: '/pages/ui-features/typography',
  //     },
  //     {
  //       title: 'Animated Searches',
  //       link: '/pages/ui-features/search-fields',
  //     },
  //   ],
  // },
  // {
  //   title: 'Modal & Overlays',
  //   icon: 'browser-outline',
  //   pageId: 4,
  //   children: [
  //     {
  //       title: 'Dialog',
  //       link: '/pages/modal-overlays/dialog',
  //       pageId: 4
  //     },
  //     {
  //       title: 'Window',
  //       link: '/pages/modal-overlays/window',
  //       pageId: 4
  //     },
  //     {
  //       title: 'Popover',
  //       link: '/pages/modal-overlays/popover',
  //       pageId: 4
  //     },
  //     {
  //       title: 'Toastr',
  //       link: '/pages/modal-overlays/toastr',
  //       pageId: 4
  //     },
  //     {
  //       title: 'Tooltip',
  //       link: '/pages/modal-overlays/tooltip',
  //       pageId: 4
  //     },
  //   ],
  // },
  // {
  //   title: 'Extra Components',
  //   icon: 'message-circle-outline',
  //   children: [
  //     {
  //       title: 'Calendar',
  //       link: '/pages/extra-components/calendar',
  //     },
  //     {
  //       title: 'Progress Bar',
  //       link: '/pages/extra-components/progress-bar',
  //     },
  //     {
  //       title: 'Spinner',
  //       link: '/pages/extra-components/spinner',
  //     },
  //     {
  //       title: 'Alert',
  //       link: '/pages/extra-components/alert',
  //     },
  //     {
  //       title: 'Calendar Kit',
  //       link: '/pages/extra-components/calendar-kit',
  //     },
  //     {
  //       title: 'Chat',
  //       link: '/pages/extra-components/chat',
  //     },
  //   ],
  // },

  // {
  //   title: 'Maps',
  //   icon: 'map-outline',
  //   children: [
  //     {
  //       title: 'Google Maps',
  //       link: '/pages/maps/gmaps',
  //     },
  //     {
  //       title: 'Leaflet Maps',
  //       link: '/pages/maps/leaflet',
  //     },
  //     {
  //       title: 'Bubble Maps',
  //       link: '/pages/maps/bubble',
  //     },
  //     {
  //       title: 'Search Maps',
  //       link: '/pages/maps/searchmap',
  //     },
  //   ],
  // },

  // {
  //   title: 'Charts',
  //   icon: 'pie-chart-outline',
  //   children: [
  //     {
  //       title: 'Echarts',
  //       link: '/pages/charts/echarts',
  //     },
  //     {
  //       title: 'Charts.js',
  //       link: '/pages/charts/chartjs',
  //     },
  //     {
  //       title: 'D3',
  //       link: '/pages/charts/d3',
  //     },
  //   ],
  // },
  // {
  //   title: 'Editors',
  //   icon: 'text-outline',
  //   children: [
  //     {
  //       title: 'TinyMCE',
  //       link: '/pages/editors/tinymce',
  //     },
  //     {
  //       title: 'CKEditor',
  //       link: '/pages/editors/ckeditor',
  //     },
  //   ],
  // },
  // {
  //   title: 'Tables & Data',
  //   icon: 'grid-outline',
  //   children: [
  //     {
  //       title: 'Smart Table',
  //       link: '/pages/tables/smart-table',
  //     },
  //     {
  //       title: 'Tree Grid',
  //       link: '/pages/tables/tree-grid',
  //     },
  //   ],
  // },
  // {
  //   title: 'Miscellaneous',
  //   icon: 'shuffle-2-outline',
  //   children: [
  //     {
  //       title: '404',
  //       link: '/pages/miscellaneous/404',
  //     },
  //   ],
  // }
];
