import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/interfaces/Categorias';
import { credentialService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent  implements OnInit{

  public categ: Categoria[] = [];
  public categId: number | null = null;
  constructor(private cred: credentialService) {}

  ngOnInit(): void {
    this.cred.categorias().subscribe((data) => {
      this.categ = data;
      console.log('cat', this.categ);
    });
  }
public  onSelectionChange(event: any): void {
  console.log('ev', event);
  this.categId = event.value.id;
}
}
