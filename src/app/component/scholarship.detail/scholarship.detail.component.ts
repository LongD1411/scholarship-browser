import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScholashipResponse } from '../../response/scholarship.response';
import { ActivatedRoute } from '@angular/router';
import { SchoolService } from '../../service/school.service';
import { ScholashipService } from '../../service/scholarship.service';
import { SchoolResponse } from '../../response/school.respone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scholarship.detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scholarship.detail.component.html',
  styleUrl: './scholarship.detail.component.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class ScholarshipDetailComponent implements OnInit {
  id: string | undefined;
  scholarship: ScholashipResponse | undefined;
  school:SchoolResponse | undefined
  constructor(
    private route: ActivatedRoute,
    private scholarshipService: ScholashipService,
    private schoolService: SchoolService,
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.id) {
      this.scholarshipService.getScholarship(this.id).subscribe({
        next: (response) => {
          this.scholarship = response.result;
          if (
            this.scholarship.grantAmount != null &&
            this.scholarship.grantAmount[0] === '$'
          ) {
            this.scholarship.grantAmount =
              this.scholarship.grantAmount.slice(1);
          }
          this.schoolService.getSchool(this.scholarship.schoolId).subscribe({
            next: (response)=>{
              this.school = response.result
            }
          })
        },
      });
    }
  }
  schoolDetail(id: number) {
    window.location.href = `/truong-hoc/chi-tiet?id=${id}`;
  }
}
