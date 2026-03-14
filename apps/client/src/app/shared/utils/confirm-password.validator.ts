import { AbstractControl } from '@angular/forms';

export function confirmPasswordValidator() {
  return (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // if password is not touched this will not trigger the validator
    if (!password && !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
