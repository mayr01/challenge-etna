import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  public camposIguales(campo1: string, campo2: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const pass1 = control.get(campo1)?.value;
      const pass2 = control.get(campo2)?.value;

      if(pass1 !== pass2) {
        control.get(campo2)?.setErrors({ noIguales: true });
        return {
          noIguales: true
        }
      }

      control.get(campo2)?.setErrors(null);

      return null
    }
  }

 


}
