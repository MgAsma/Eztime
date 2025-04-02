import { FormGroup } from '@angular/forms';

export class FormUtils {

  // This function checks if any form has unsaved changes
  static hasUnsavedChanges(initialFormState: any, formGroups: FormGroup[]): boolean {
    return formGroups.some((formGroup: FormGroup) => 
      this.areFormsDifferent(initialFormState[formGroup?.['name']], formGroup.getRawValue())
    );
  }

  // This function compares the initial and current form states
  private static areFormsDifferent(initial: any, current: any): boolean {
    return JSON.stringify(this.cleanObject(initial)) !== JSON.stringify(this.cleanObject(current));
  }

  // Remove undefined or null values to avoid false differences in comparison
  private static cleanObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj, (key, value) => value === null ? undefined : value));
  }

  // This function checks if a form is dirty
  static isFormDirty(formGroup: FormGroup): boolean {
    return formGroup.dirty;
  }
}
