import { FormGroup } from '@angular/forms';

export function getDirtyFields(form: FormGroup) {
  return Object.fromEntries(
    Object.entries(form.controls)
      .filter(([, control]) => control.dirty)
      .map(([key, control]) => [key, control.value]),
  );
}
