import { AbstractControl } from '@angular/forms';

export function getValidationErrorMessage(
  control: AbstractControl | null | undefined,
  label: string,
): string | null {
  if (!control || !control.errors || !control.touched) {
    return null;
  }

  const errors = control.errors;

  if (errors['required']) {
    return `${label} is required`;
  }

  if (errors['minlength']) {
    const requiredLength = (errors['minlength'] as { requiredLength: number }).requiredLength;
    return `${label} must be at least ${requiredLength} characters`;
  }

  if (errors['email']) {
    return `Invalid ${label.toLowerCase()} address`;
  }

  return null;
}

