import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { credentialService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
Search() {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}
public count: number = 0;
  constructor(private fb: FormBuilder, private router: Router, private cred: credentialService ) {}
  ngOnInit(): void {
    this.cred.countTask().subscribe((data: any) => {
      console.log('cat', data);
      this.count = data.incomplete_task_count;
      console.log(this.count);      ;
    });
  }

  public newTask(){
    this.router.navigate(['/new-task']);
  }
}
