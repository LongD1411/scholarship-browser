import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchoolService } from '../../service/school.service';
import { SchoolResponse } from '../../response/school.respone';

@Component({
  selector: 'app-school.detail',
  standalone: true,
  imports: [],
  templateUrl: './school.detail.component.html',
  styleUrl: './school.detail.component.css'
})
export class SchoolDetailComponent implements OnInit {
  id: string | undefined;
  school:SchoolResponse | undefined
  constructor(  private route: ActivatedRoute,private schoolService:SchoolService){}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    if(this.id){
      this.schoolService.getSchool(Number.parseInt(this.id)).subscribe({
        next:(response)=>{
          this.school= response.result
        }
      })
    }
  }

}
