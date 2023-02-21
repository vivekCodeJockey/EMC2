import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-termandcondition',
  templateUrl: './termandcondition.component.html',
  styleUrls: ['./termandcondition.component.scss']
})
export class TermandconditionComponent implements OnInit {

  height = 500;
  constructor() {
    const vh = (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
    this.height = Math.floor(vh - 300)
  }

  ngOnInit(): void {
  }

}
