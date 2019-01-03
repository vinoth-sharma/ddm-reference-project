import { Injector } from "@angular/core";

export let AppInjector: Injector;

export function setAppInjector(injector: Injector) {

  if (AppInjector) {
    console.error("programming error: AppInjector was already set");
  } else {
    AppInjector = injector;
  }
  
}
