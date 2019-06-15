import { CustomModalsModule } from './custom-modals.module';

describe('CustomModalsModule', () => {
  let customModalsModule: CustomModalsModule;

  beforeEach(() => {
    customModalsModule = new CustomModalsModule();
  });

  it('should create an instance', () => {
    expect(customModalsModule).toBeTruthy();
  });
});
