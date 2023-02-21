import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class APIService {
    private apiAccess = "";
    private noRestrictedAccess = false;
    constructor(private http: HttpClient) {
        if (environment.INTERNAL_APP) {
            this.apiAccess = "internal"
        } else {
            this.apiAccess = "external"
        }

    }

    postAPI(url: String, reqParams: any, options?) {
        this.noRestrictedAccess = url.includes('auth')
        // if (url.includes('auth')) {
        //     this.noRestrictedAccess = true
        // }else{

        // }
        return this.http.post(environment.APP_URL + ((!this.noRestrictedAccess) ? this.apiAccess : '') + url, reqParams, options);
    }

    putAPI(url: String, reqParams: any) {
        // if (url.includes('auth')) {
        //     this.noRestrictedAccess = true
        // }
        this.noRestrictedAccess = url.includes('auth')
        return this.http.put(environment.APP_URL + ((!this.noRestrictedAccess) ? this.apiAccess : '') + url, reqParams);
    }

    getAPI(url: String, reqParams: any) {
        // if (url.includes('auth')) {
        //     this.noRestrictedAccess = true
        // }
        this.noRestrictedAccess = url.includes('auth')
        return this.http.get(environment.APP_URL + ((!this.noRestrictedAccess) ? this.apiAccess : '') + url, { params: reqParams });
    }

    deleteAPI(url: String, reqParams: any) {
        // if (url.includes('auth')) {
        //     this.noRestrictedAccess = true
        // }
        this.noRestrictedAccess = url.includes('auth')
        return this.http.delete(environment.APP_URL + ((!this.noRestrictedAccess) ? this.apiAccess : '') + url, { params: reqParams });
    }


    isAppInternal() {
        return environment.INTERNAL_APP
    }

}