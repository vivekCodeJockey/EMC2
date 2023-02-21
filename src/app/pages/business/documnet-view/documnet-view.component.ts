import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NbIconLibraries, NbWindowService, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { CommonService } from '../../common.service';
import { mainViewComponent } from '../mainview/mainview.component';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[] | any;
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
  id?: number
}
@Component({
  selector: 'ngx-documnet-view',
  templateUrl: './documnet-view.component.html',
  styleUrls: ['./documnet-view.component.scss']
})
export class DocumnetViewComponent implements OnInit {

  evaIcons;
  fileToUpload: File | null = null;
  fieldSize: any = "small";
  extensionType: any;
  base64: any;
  // qFile: any;
  // qFileId: any;
  fileInput: any;
  existingJrfId: any;
  existingObj: any;
  customColumn = 'name';
  // defaultColumns = ['size', 'kind', 'items','action'];
  defaultColumns = ['size', 'items', 'action'];
  clientHeight;
  internalJrf:boolean=false;
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  private treeData: TreeNode<FSEntry>[];

  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;


  constructor(private parent: mainViewComponent, iconsLibrary: NbIconLibraries, private docService: CommonService, private windowService: NbWindowService, private router: Router, private sanitizer: DomSanitizer, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private toastrService: nvtoastrService) {
    this.clientHeight  = (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))-150
    if (parent && parent.jrfHiddenId != 0) {
      this.existingJrfId = this.parent.jrfHiddenId;
      this.existingObj = this.parent.jrfObj;
      this.internalJrf=this.parent.jrfObj['jrfType']=='internal'
      this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
        .filter(icon => icon.indexOf('outline') === -1);
      this.getFileList();
    } else {
      this.router.navigate(["/pages/"]);
    }
  }

  ngOnInit(): void { }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadDocument(event) {
    if (this.fileToUpload) {
      event.target.disabled = true;
      const endpoint = "/file/uploadDocument";
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('fileType', "PO");
      formData.append('referenceId', this.existingJrfId);
      formData.append('referenceType', "JRF");
      formData.append('referenceCategory', "PO");
      formData.append('fileDescription', "PO File");
      const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
      this.docService.postAPI(endpoint, formData, { headers: headers }).subscribe((res: any) => {
        if (res.code == 200) {
          this.fileInput = "";
          this.fileToUpload = null;
          this.getFileList();
          this.toastrService.showToast("success", "Document", res.message, "BOTTOM_RIGHT");
        } else {
          this.docService.openDialog("Error", res.message, [], "danger");
        }
        event.target.disabled = false;
      }, error => {
        event.target.disabled = false;
        console.log(error);
      });
    } else {
      this.docService.openDialog("Warning", "Please Choose File", [], "warning");
    }
  }

  viewDocument(param, rowData) {
    rowData['disabled'] = true;
    let url = "/file/getBase64Encode";
    let params = { fileId: param }
    this.docService.getAPI(url, params).subscribe((res: any) => {
      if (res.code == 200) {
        let data = res.data;
        this.extensionType = data.extensionType;
        this.base64 = data.base64;
        this.windowService.open(
          this.contentTemplate,
          {
            title: 'File View',
            context: this.base64,
            hasBackdrop: true,
            closeOnEsc: false,
            buttons: {
              minimize: false,
              maximize: false,
              fullScreen: true,
            }
          });
        this.toastrService.showToast("success", "Document", "Document view opened", "BOTTOM_RIGHT");
      } else {
        this.docService.openDialog("Error", res.message, [], "danger");
      }
      rowData['disabled'] = false;
    }, (err) => {
      console.log(err);
      rowData['disabled'] = false;
    });
  }

  downloadDocument(param, rowData) {
    rowData['disabled'] = true;
    let url = "/file/getBase64Encode";
    let params = { fileId: param }
    this.docService.getAPI(url, params).subscribe((res: any) => {
      if (res.code == 200) {
        let data = res.data;
        let base64 = "data:" + data.extensionType + ";base64," + data.base64;
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.setAttribute("href", base64);
        link.setAttribute("download", data.fileName);
        link.click();
        this.toastrService.showToast("success", "Document", "Document will be downloaded", "BOTTOM_RIGHT");
      } else {
        this.docService.openDialog("Error", res.message, [], "danger");
      }
      rowData['disabled'] = false;
    }, (err) => {
      console.log(err);
      rowData['disabled'] = false;
    });
  }

  getFileList() {
    let url = "/file/getFileList";
    let params = { seqId: this.existingJrfId }
    this.docService.getAPI(url, params).subscribe((res: any) => {
      if (res.code == 200) {
        let data = res.data;
        let gdata = data.reduce((group, item) => {
          const { referenceCategory } = item;
          group[referenceCategory] = group[referenceCategory] ?? [];
          group[referenceCategory].push({ data: item });
          return group;
        }, {});
        this.treeData = [];
        for (let key in gdata) {
          let value = gdata[key];
          let tSize = value.reduce((accumulator, obj) => {
            return accumulator + obj.data.size;
          }, 0);
          this.treeData.push({ data: { name: key, size: tSize, items: value.length, kind: 'dir' }, children: value })
        }
        this.dataSource = this.dataSourceBuilder.create(this.treeData);
      }
    }, (err) => {
      console.log(err);
    });
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }


}
@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
