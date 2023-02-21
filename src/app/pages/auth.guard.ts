import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { MENU_ITEMS } from './pages-menu';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        if (!this.getAccessToken) {
            this.router.navigate(['auth'], { skipLocationChange: true });
        }
        this.checkIfMenuPermit(state)
        return this.getAccessToken;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(route, state);
    }

    get getAccessToken() {
        let userInfo = localStorage.getItem("accesToken");
        return userInfo ? true : false;
    }

    userRolePer = JSON.parse(localStorage.getItem("permission"));
    menu = MENU_ITEMS;
    checkIfMenuPermit(state) {
        let menu = this.menu.filter((item: any) => {
            return item.link && state.url && state.url.includes(item.link);
        })
        if (menu && menu.length > 0) {
            let page = this.userRolePer.find(obj => obj.pageId === menu[0].pageId)
            if ((!page) || (page && !page.isView)) {
                console.log("Not Permited");
                this.router.navigate(['pages/notfound'], { skipLocationChange: true });
            }
        }
    }
}
