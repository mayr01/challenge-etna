import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/interfaces/Categorias';
import { NewTask } from 'src/app/interfaces/NewTask';
import { credentialService } from 'src/app/services/credentials.service';
import { ValidatorService } from 'src/app/services/validator.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  frm!: FormGroup;
  public categ: Categoria[] = [];
  public categId!: number;
  public task!: NewTask;
  constructor(private router: Router, private cred: credentialService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.frm = this.fb.group({
      nameTask: ['', [Validators.required,]],
      priority: ['', [Validators.required,]],
      categoria: ['', [Validators.required,]],
      description: ['', [Validators.required]],
    });

    this.cred.categorias().subscribe((data) => {
      this.categ = data;
      console.log('cat', this.categ);
    });
  }
  public campoValido(campo: string): boolean | null {
    return this.frm.controls[campo].errors && this.frm.controls[campo].touched;
  }

  public onSelectionChange(event: any): void {
    this.categId = event.value;
  }
  public llenarCampos(): void {
    if (this.frm.valid) {
      this.task = {
        title: this.frm.get('nameTask')?.value.toUpperCase(),
        description: this.frm.get('description')?.value,
        priority: this.frm.get('priority')?.value,
        category_id: this.categId,
      };
    }
  }

  public onClick() {
    if(this.frm.valid){
      this.llenarCampos();
      this.cred.CrearTask(this.task).subscribe((data) => {
        console.log('dat', data);
        if(data){
          Swal.fire('¡Operación exitosa!', 'Tarea creada con éxito', 'success');
          this.frm.reset();
        }

      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: '¡Error al crear la tarea!',
          text: 'Porfavor vuelva a realizar la operación.',
        });
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: '¡Error al crear la tarea!',
        text: 'Porfavor verifique que los campos esten completos y vuelva a realizar la operación.',
      });
    }
  }
  public volver() {
    this.router.navigate(['/home']);

  }
}
