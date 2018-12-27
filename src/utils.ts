export default class Utils {

  static closeAllModals() {
    let modals = document.querySelectorAll('.modal.fade.in.show');

    setTimeout(() => {
      for (let i = 0; i < modals.length; i++) {
        console.log('in for', modals[i], modals[i].querySelector('.close'));
        (<HTMLElement>modals[i].querySelector('.close')).click();
      }
    });
  }
}