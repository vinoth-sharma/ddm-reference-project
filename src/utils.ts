import { NgxSpinnerService } from "ngx-spinner";
import { Injector } from "@angular/core";
import { AppInjector } from "./app-injector";

export default class Utils {
  private static spinner;
  constructor() {
    Utils.createSPinnerInstance();
  }

  static createSPinnerInstance() {
    if (!this.spinner) this.spinner = AppInjector.get(NgxSpinnerService);
  }

  static closeModals() {
    let modals = document.querySelectorAll('.modal.fade.in.show');

    setTimeout(() => {
      for (let i = 0; i < modals.length; i++) {
        (<HTMLElement>modals[i].querySelector(".close")).click();
      }
    });
  }

  static showSpinner() {
    Utils.createSPinnerInstance();
    this.spinner.show();
  }

  static hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
}
