import { async, TestBed } from '@angular/core/testing';
import { SharedDesignSystemInterfacesModule } from './shared-design-system-interfaces.module';

describe('SharedDesignSystemInterfacesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDesignSystemInterfacesModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedDesignSystemInterfacesModule).toBeDefined();
  });
});
