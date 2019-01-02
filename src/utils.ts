export default class Utils {

  static closeModals() {
    let modals = document.querySelectorAll('.modal.fade.in.show');

    setTimeout(() => {
      for (let i = 0; i < modals.length; i++) {
        (<HTMLElement>modals[i].querySelector('.close')).click();
      }
    });
  }
}