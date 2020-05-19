/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  DtRandomModule,
  Add,
  Mult,
} from '@dynatrace/barista-components/random';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('random suite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtRandomModule],
      declarations: [RandomConsumer],
    });

    TestBed.compileComponents();
  });

  it('basic add', () => {
    let i = 0;
    while (i < 5000) {
      expect(Add(1, i)).toBe(i + 1);
      i++;
    }
  });

  it('basic mult', () => {
    let i = 1;
    while (i < 50000) {
      expect(Mult(2, i)).toBe(i * 2);
      i++;
    }
  });

  it('basic test', () => {
    const fixture = TestBed.createComponent(RandomConsumer);
    fixture.detectChanges();
    const pElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(pElement.textContent).toBe('Random works');
  });
});

@Component({
  selector: 'random-consumer',
  template: `<dt-rand></dt-rand>`,
})
class RandomConsumer {}
