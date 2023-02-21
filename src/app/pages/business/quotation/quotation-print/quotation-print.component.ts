import { Component, OnInit, Input } from '@angular/core';
import * as converter from 'number-to-words';

@Component({
  selector: 'ngx-quotation-print',
  templateUrl: './quotation-print.component.html',
  styleUrls: ['./quotation-print.component.scss']
})
export class QuotationPrintComponent implements OnInit {

  @Input() rowData: any[];
  @Input() formData: any;
  @Input() tWord: String = ''
  @Input() jrfDtl: any;
  today = new Date();
  constructor() {
  }
  ngOnInit(): void {
    console.log(this.formData)
  }
}
