import { CreateReportModule } from './create-report.module';

describe('CreateReportModule', () => {
  let createReportModule: CreateReportModule;

  beforeEach(() => {
    createReportModule = new CreateReportModule();
  });

  it('should create an instance', () => {
    expect(createReportModule).toBeTruthy();
  });
});
