import { AppInjector } from "./app-injector";
import { NgLoaderService } from './app/custom-directives/ng-loader/ng-loader.service';

export default class Utils {
  private static spinner;

  static closeModals() {
    let modals = document.querySelectorAll('.modal.fade.in');
    setTimeout(() => {
      for (let i = 0; i < modals.length; i++) {
        (<HTMLElement>modals[i].querySelector(".close")).click();
      }
    });
  }

  /*****  NgxSpinnerService Part *****/
  static createSpinnerInstance() {
    this.spinner = AppInjector.get(NgLoaderService);
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
