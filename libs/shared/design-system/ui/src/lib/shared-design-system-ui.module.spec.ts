import { async, TestBed } from '@angular/core/testing';
import { SharedDesignSystemUiModule } from './shared-design-system-ui.module';

describe('SharedDesignSystemUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDesignSystemUiModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedDesignSystemUiModule).toBeDefined();
  });
});
