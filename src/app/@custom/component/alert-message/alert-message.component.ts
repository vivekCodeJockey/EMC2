import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent {

  @Input() title: string;
  //Possible values success,danger,warning
  @Input() status: string = "success";
  //Possible values tiny,snall,medium,large,giant
  @Input() size: string = "tiny";
  @Input() message: string;
  @Input() messageList: Array<String>;

  constructor(protected ref: NbDialogRef<AlertMessageComponent>) { }

  dismiss() {
    this.ref.close();
  }

}
