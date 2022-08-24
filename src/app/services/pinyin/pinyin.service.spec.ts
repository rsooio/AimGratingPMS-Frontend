import { TestBed } from '@angular/core/testing';

import { PinyinService } from './pinyin.service';

describe('PinyinService', () => {
  let service: PinyinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinyinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
