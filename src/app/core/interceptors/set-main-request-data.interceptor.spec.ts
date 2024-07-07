import { TestBed } from '@angular/core/testing';

import { SetMainRequestDataInterceptor } from './set-main-request-data.interceptor';

describe('SetMainRequestDataInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SetMainRequestDataInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SetMainRequestDataInterceptor = TestBed.inject(SetMainRequestDataInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
