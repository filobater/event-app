import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-number-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
  templateUrl: './number-input.component.html',
})
export default class NumberInputComponent implements ControlValueAccessor {
  private static idCounter = 0;
  readonly inputId = `number-input-${++NumberInputComponent.idCounter}`;

  id = input<string>('');
  labelText = input<string>('');
  placeholder = input<string>('0');
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input<number | string>(1);

  protected value = signal<number | null>(null);
  protected isDisabled = signal(false);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected get resolvedId() {
    return this.id() || this.inputId;
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected handleInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const value = raw === '' ? null : Number(raw);
    this.value.set(value);
    this.onChange(value);
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}
