import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { credentialService } from '../../services/credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  frm!: FormGroup;
  public showPassword: boolean = true;
  constructor(private fb: FormBuilder, private router: Router, private credentialService: credentialService ) {}

  ngOnInit(): void {
    this.frm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onClick() {
    this.router.navigate(['/sig-in']);
  }

  onSubmit() {
    this.credentialService.login(this.frm.get('email')?.value, this.frm.get('password')?.value).subscribe(
      response => {
        console.log('Login exitoso', response);
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error de inicio de sesión', error);

      }
    );
  }
  
}
