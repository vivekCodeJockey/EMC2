import { Directive, ElementRef, HostListener, Input, Optional, Renderer2 } from '@angular/core';
import { DecimalPipe, formatCurrency } from "@angular/common";
import { NgControl } from "@angular/forms";

@Directive({
  selector: 'input[nvValidate]'
})
export class FieldValidationDirective {



  textbox: HTMLInputElement;

  ngAfterViewInit() {
    this.textbox =
      this.e.nativeElement.tagName === "INPUT"
        ? this.e.nativeElement
        : this.e.nativeElement.querySelector("input");
  }

  constructor(private e: ElementRef, private renderer: Renderer2, private decimalPipe: DecimalPipe, @Optional() private ngControl: NgControl,) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    let element = this.e.nativeElement;
    var dataType = element.getAttribute("nvValidate");
    const initalValue = element.value;
    switch (dataType) {
      case 'character':
        element.value = initalValue.replace(/[^A-Za-z]*/g, '');
        break;
      case 'number':
        element.value = initalValue.replace(/[^0-9]*/g, '');
        break;
      case 'alphaNumeric':
        element.value = initalValue.replace(/[^A-Za-z0-9]*/g, '');
        break;
      case 'alphaNumericWithDot':
        element.value = initalValue.replace(/[^A-Za-z0-9\.]*/g, '');
        break;
      case 'email':
        element.value = initalValue.replace(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, '');
        break;
      case 'panNumber':
        element.value = initalValue.replace(/[^a-z{2}]$/i, '');
        break;
      case 'decimal':
        element.value = initalValue.replace(/[^0-9\.]*/g, '');
        break;
      case 'amount':
        // if(event.data&&event.data=='.'&&initalValue.indexOf('.') > -1){
        //   return false
        // }else{
          element.value = initalValue.replace(/[^0-9\.]*/g, '');
          break;
        // }
    }
    if (initalValue !== element.value) {
      event.stopPropagation();
    }

  }

  @HostListener("blur", ["$event"]) onBlur(event) {
    if (this.textbox.getAttribute("nvValidate") == "amount") {
      if(this.textbox.value&&Number(this.textbox.value)){
        const formattedVal = this.decimalPipe.transform(
          this.textbox.value,
          "1.2-2", 'en-IN'
        );
        if (this.ngControl) {
          this.ngControl.control.setValue(formattedVal, { emitEvent: false });
        } else {
          this.renderer.setProperty(this.textbox, "value", formattedVal);
        }
      }else{
        if (this.ngControl) {
          this.ngControl.control.setValue('0.00', { emitEvent: false });
        } else {
          this.renderer.setProperty(this.textbox, "value", '0.00');
        }
      }
    }
  }

  @HostListener("focus", ["$event"]) onFocus(event) {
    if (this.textbox.getAttribute("nvValidate") == "amount") {
      const initVal = this.textbox.value.replace(/,/g, '');
      if (this.ngControl) {
        this.ngControl.control.setValue(initVal, { emitEvent: false });
      } else {
        this.renderer.setProperty(this.textbox, "value", initVal);
      }
    }
  }

}




