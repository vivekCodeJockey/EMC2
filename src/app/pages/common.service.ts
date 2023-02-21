import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AlertMessageComponent } from '../@custom/component/alert-message/alert-message.component';
import { UntypedFormGroup } from '@angular/forms';
import { APIService } from '../pages/api.service';
import { HttpClient } from '@angular/common/http';
import { IDatasource, IGetRowsParams } from "ag-grid-community";

@Injectable()
export class CommonService extends APIService {

    constructor(http: HttpClient, private dialogService: NbDialogService) {
        super(http);
    }

    userId() {
        let user = JSON.parse(localStorage.getItem("userInfo"))
        return user.userDtl.id
    }

    openDialog(dialogTitle, dialogMessage, dialogMessageList, dialogStatus) {
        this.dialogService.open(AlertMessageComponent, {
            context: {
                title: dialogTitle,
                message: dialogMessage,
                messageList: dialogMessageList,
                status: dialogStatus
            },
        });
    }

    getErrorList(formGroup: UntypedFormGroup) {
        var controlName: any
        var errorMsgList = [];
        for (controlName in formGroup['controls']) {
            let control = formGroup.controls[controlName];
            if (control.errors) {
                let msg = "";
                Object.keys(control.errors).map(error => {
                    if (error = "required") {
                        msg = " should not be empty"
                    }
                    control.errors[error] ? errorMsgList.push(controlName + msg) : ''
                });
            }
        }
        return errorMsgList;
    }

    gridAddRow(gridApi: any, gridData?: any[], pagination?: boolean) {
        if (pagination) {
            const colDefs = gridApi.getColumnDefs();
            const newRowObj = {};
            colDefs.forEach((eachColDef) => {
                const { field } = eachColDef;
                newRowObj[field] = null;
            });
            let newRow = [newRowObj];
            gridData = [gridData, ...newRow];
            return gridData;
        } else {
            gridApi.applyTransaction({ add: [{}] })
        }
    }

    setGridDynamicRowCnt(gridOptions, defaultHeight) {
        const vh = (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
        let height = Math.floor((vh - defaultHeight) / 30)
        let minCache = 3
        gridOptions.paginationPageSize = (height > minCache) ? height : minCache
        gridOptions.cacheBlockSize = (height > minCache) ? height : minCache
    }

    getPermission(pageId: number) {
        if (JSON.parse(localStorage.getItem("permission")) == 100) {
            return { isCreate: true, isEdit: true, isDelete: true };
        } else {
            let perm = JSON.parse(localStorage.getItem("permission"))
            if (perm) {
                let pageaccess = perm.find(obj => obj.pageId === pageId);
                return pageaccess;
            } else {
                return { isCreate: false, isEdit: false, isDelete: false };
            }
        }
    }

    gridPaginationGetRows(grid, cdr, apiUrl, gridDataList?, loadingRef?) {
        const dataSource: IDatasource = {
            getRows: (params: IGetRowsParams) => {
                grid.showLoadingOverlay();
                const limit = grid.gridOptionsWrapper.gridOptions.cacheBlockSize;
                const offset = grid.paginationGetCurrentPage();
                const payload: any = grid.payload ? grid.payload : {};
                payload["searchText"] = grid.searchText ? grid.searchText.trim() : '';
                loadingRef = true;
                const url = apiUrl + "?pageSize=" + limit + "&pageNum=" + offset;
                this.getAPI(url, payload).subscribe(
                    (res: any) => {
                        grid.hideOverlay();
                        if (res.data && typeof res.data === 'object'&&(!Array.isArray(res.data))) {
                            gridDataList = [res.data];
                            params.successCallback(
                                res.data ? [res.data] : [],
                                res.total ? res.total : 0
                            );
                        } else if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                            gridDataList = res.data;
                            params.successCallback(
                                res.data ? res.data : [],
                                res.total ? res.total : 0
                            );
                        } else {
                            grid.showNoRowsOverlay();
                            params.successCallback([], 0);
                        }
                        cdr.markForCheck();
                        loadingRef = false;
                    },
                    (err: any) => {
                        cdr.markForCheck();
                        loadingRef = false;
                    }
                );
            },
        };
        return dataSource;
    }

}