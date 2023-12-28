import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { Location } from '@angular/common';
import { credentialService } from 'src/app/services/credentials.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { NewUser } from 'src/app/interfaces/NewUser';

@Component({
  selector: 'app-sig-in',
  templateUrl: './sig-in.component.html',
  styleUrls: ['./sig-in.component.scss']
})
export class SigInComponent implements OnInit {
  frm!: FormGroup;
  public login = `$/login?callbackURL=${window.location.href}`;
  public showPassword: boolean = true;
  public showConfirmationPassword: boolean = true;
  private email: string = '';
  private responseStatus: string | null = null;
  private user!: NewUser;

  constructor(private fb: FormBuilder, private validatorService: ValidatorService,
    private location: Location, private credentialSrv: credentialService) { }

  ngOnInit(): void {
    this.frm = this.fb.group({
      name: ['', [Validators.required,]],
      lName: ['', [Validators.required,]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password1: ['', [Validators.required, Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.*\d)(?=.*[A-Z]).{8,}$/), Validators.minLength(8)]],
      password2: ['', [Validators.required]]
    }, {
      validators: [this.validatorService.camposIguales('password1', 'password2')]
    });
  }

  public campoValido(campo: string): boolean | null {
    return this.frm.controls[campo].errors && this.frm.controls[campo].touched;
  }
  public llenarCampos(): void {
    if (this.frm.valid) {
      this.user = {
        first_name: this.frm.get('name')?.value.toUpperCase(),
        last_name: this.frm.get('lName')?.value.toUpperCase(),
        email: this.frm.get('email')?.value,
        password: this.frm.get('password1')?.value,
      };
    }
  }

  public validateEmail() {
    this.llenarCampos();
    this.credentialSrv.validateEmail(this.frm.get('email')?.value).subscribe(
      (response) => {
        if (response.status == 200) {
          Swal.fire({
            icon: 'error',
            title: '¡Email registrado!',
            text: 'El email ya se encuentra registrado a un usuario.',
          });
        }
      },
      (error) => {
        if (error.status == 404) {
          this.credentialSrv
            .RegistrarUsuario(this.user)
            .subscribe(
              (val: any) => {
           Swal.fire('¡Operación exitosa!', 'Usuario registrado con éxito', 'success');                
           this.goBack();
              },
              (err) => {
                Swal.fire({
                  icon: 'error',
                  title: '¡Error al registrar el usuario!',
                  text: 'Porfavor vuelva a realizar la operacion.',
                });
              });

        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error al validar el email!',
            text: 'Porfavor vuelva a realizar la operacion.',
          });
        }
      }
    );
  }

  onSubmit() {
    this.validateEmail();
  }

  public goBack(): void {
    this.location.back();
  }
}
