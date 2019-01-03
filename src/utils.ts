import { NgxSpinnerService } from "ngx-spinner";
import { AppInjector } from "./app-injector";

export default class Utils {
  private static spinner;

  static closeModals() {
    let modals = document.querySelectorAll(".modal.fade.in.show");

    setTimeout(() => {
      for (let i = 0; i < modals.length; i++) {
        (<HTMLElement>modals[i].querySelector(".close")).click();
      }
    });
  }

  /*****  NgxSpinnerService Part *****/
  static createSpinnerInstance() {
    this.spinner = AppInjector.get(NgxSpinnerService);
  }

  static showSpinner() {
    if (!this.spinner) Utils.createSpinnerInstance();
    this.spinner.show();
  }

  static hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
}
