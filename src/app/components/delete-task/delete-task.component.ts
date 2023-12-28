import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.scss']
})
export class DeleteTaskComponent implements OnInit {

  public mensaje: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  ngOnInit(): void {
    this.mensaje = this.dialogData.mensaje;
  }
}
