import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpClient,
    HttpHeaders,
    HttpParams
} from "@angular/common/http";
import { NbDialogService } from '@nebular/theme';
import { throwError, Observable, BehaviorSubject, of } from "rxjs";
import { catchError, filter, take, switchMap, finalize, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AlertMessageComponent } from '../@custom/component/alert-message/alert-message.component';
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private http: HttpClient, private dialogService: NbDialogService, private router: Router) { }
    private AUTH_HEADER = "Authorization";
    private token = this.getAccessToken();
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!req.headers.has("Content-Type")) {
            req = req.clone({
                headers: req.headers.set("Content-Type", "application/json")
            });
        } else {
            if (req.headers.get("Content-Type").toLowerCase() === 'multipart/form-data') {
                req = req.clone({
                    headers: req.headers.delete("Content-Type")
                });
            }
        }

        req = this.addAuthenticationToken(req);

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401) {
                    // 401 errors are most likely going to be because we have an expired token that we need to refresh.
                    if (this.refreshTokenInProgress) {
                        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                        // which means the new token is ready and we can retry the request again
                        return this.refreshTokenSubject.pipe(
                            filter(result => result !== null),
                            take(1),
                            switchMap(() => next.handle(this.addAuthenticationToken(req)))
                        );
                    } else {
                        this.refreshTokenInProgress = true;

                        // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                        this.refreshTokenSubject.next(null);

                        return this.getAccessTokenUsingRefreshToken().pipe(
                            switchMap((success: boolean) => {
                                this.refreshTokenSubject.next(success);
                                return next.handle(this.addAuthenticationToken(req));
                            }),
                            // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                            // for the next time the token needs to be refreshed
                            finalize(() => (this.refreshTokenInProgress = false))
                        );
                    }
                } else if (error && error.status === 403) {
                    this.router.navigate(['auth'], { skipLocationChange: true });
                }
                else if (error && error.status === 404) {
                    this.router.navigate(['pages/notfound'], { skipLocationChange: true });
                }
                else {
                    if (error == undefined || error.status == 0) {
                        this.router.navigate(['auth'], { skipLocationChange: true });
                        return;
                    }
                    let msg = error.error.message ? error.error.message : error.error.error;
                    this.dialogService.open(AlertMessageComponent, {
                        context: {
                            title: 'ERROR ' + error.name,
                            message: "Please contact system adminstrator for help : " + msg,
                            status: "danger"
                        }
                    })
                    console.log(error)
                    return throwError(error);
                }
            })
        ) as Observable<HttpEvent<any>>;
    }

    getAccessTokenUsingRefreshToken(): Observable<any> {
        if (this.refreshAccessToken()) {
            let Params = {
                'refreshToken': this.refreshAccessToken()
            }
            return this.http.post(environment.APP_URL + "auth/refreshtoken", Params)
                .pipe(
                    map((token: any) => {
                        localStorage.setItem("accesToken", token.accessToken);
                        localStorage.setItem("refreshToken", token.refreshToken);
                        return token.accessToken;
                    }));
        }

    }


    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        this.token = this.getAccessToken();
        if (!this.token) {
            return request;
        }
        // If you are calling an outside domain then do not add the token.
        // if (!request.url.match(/www.mydomain.com\//)) {
        //   return request;
        // }
        if (request.url.match("auth/signin") || request.url.match("auth/refreshtoken")) {
            return request;
        }
        return request.clone({
            headers: request.headers.set(this.AUTH_HEADER, "Bearer " + this.token)
        });
    }

    private getAccessToken() {
        let userInfo = localStorage.getItem("accesToken");
        return userInfo;
    }

    private refreshAccessToken() {
        let userInfo = localStorage.getItem("refreshToken");
        return userInfo;
    }
}