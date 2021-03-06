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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';
import { DtCombobox } from '@dynatrace/barista-components/experimental/combobox';

const allOptions: { name: string; value: string }[] = [
  { name: 'Value 1', value: '[value: Value 1]' },
  { name: 'Value 2', value: '[value: Value 2]' },
  { name: 'Value 3', value: '[value: Value 3]' },
  { name: 'Value 4', value: '[value: Value 4]' },
];

@Component({
  selector: 'combobox-dev-app-demo',
  templateUrl: 'combobox-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxDemo implements AfterViewInit {
  @ViewChild(DtCombobox) combobox: DtCombobox<any>;

  _initialValue = allOptions[0];
  _options = [...allOptions];
  _loading = false;
  _displayWith = (option: { name: string; value: string }) => option.name;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.combobox.selectionChange.subscribe((val) => {
      console.log(val);
    });
  }

  openedChanged(event: boolean): void {
    console.log(`openedChanged: '${event}'`);
  }

  valueChanged(event: string): void {
    console.log(`valueChanged: '${event}'`);
  }

  filterChanged(event: string): void {
    console.log(`filterChanged: '${event}'`);

    this._loading = true;
    this._changeDetectorRef.markForCheck();

    timer(1500)
      .pipe(take(1))
      .subscribe(() => {
        this._options = allOptions.filter(
          (option) =>
            option.value.toLowerCase().indexOf(event.toLowerCase()) >= 0,
        );
        this._loading = false;
        this._changeDetectorRef.markForCheck();
      });
  }

  selectedValue: string;
  coffees = [
    { value: 'ThePerfectPour', viewValue: 'ThePerfectPour' },
    { value: 'Affogato', viewValue: 'Affogato' },
    { value: 'Americano', viewValue: 'Americano' },
  ];
}
