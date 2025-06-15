import { Component, NgModule, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScholashipService } from './service/scholarship.service';
import { SchoolService } from './service/school.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScholashipResponse } from './response/scholarship.response';
import { SchoolResponse } from './response/school.respone';
import { AuthService } from './service/auth.service';
import { SweetAlertService } from './service/sweet.alert.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  hideHeader: boolean = false;
  scholarshipSearch$ = new Subject<string>();
  schoolSearch$ = new Subject<string>();

  filteredScholarships: ScholashipResponse[] = [];
  filteredSchools: SchoolResponse[] = [];
  private subscriptions: Subscription[] = [];
  showScholarshipDropdown = false;
  showSchoolDropdown = false;
  ngOnInit(): void {
    const sub1 = this.scholarshipSearch$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((keyword) => {
        if (keyword.trim()) {
          this.scholarshipService.getScholarships(keyword, '', '', 1, 10).subscribe({
            next: (response) => {
              this.filteredScholarships = response.results;
              this.showScholarshipDropdown = this.filteredScholarships.length > 0;
            },
            error: () => {
              this.filteredScholarships = [];
              this.showScholarshipDropdown = false;
            },
          });
        } else {
          this.filteredScholarships = [];
          this.showScholarshipDropdown = false;
        }
      });

    const sub2 = this.schoolSearch$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((keyword) => {
        if (keyword.trim()) {
          this.schoolService.getSchools(keyword, '', 1, 10).subscribe({
            next: (response) => {
              this.filteredSchools = response.results;
              this.showSchoolDropdown = this.filteredSchools.length > 0;
            },
            error: () => {
              this.filteredSchools = [];
              this.showSchoolDropdown = false;
            },
          });
        } else {
          this.filteredSchools = [];
          this.showSchoolDropdown = false;
        }
      });

    this.subscriptions.push(sub1, sub2);
  }

  constructor(private scholarshipService: ScholashipService, private schoolService: SchoolService,private authService: AuthService,
              private alert: SweetAlertService,private router: Router) {
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = (event as NavigationEnd).urlAfterRedirects.split('?')[0];
        this.hideHeader = url === '/dang-nhap' || url === '/dang-ki';
      });
  }
  onScholarshipInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const keyword = target.value;
      this.scholarshipSearch$.next(keyword);
    }
  }


  onSchoolInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const keyword = target.value;
      this.schoolSearch$.next(keyword);
    }
  }
  selectUniversity(id: number): void {
    window.location.href = `/truong-hoc/chi-tiet?id=${id}`;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  logout() {
    this.alert.showConfirm('Cảnh bảo', 'Xác nhận đăng xuất').then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: (response) => {
            this.authService.removeToken();
            localStorage.removeItem('user_name')
            window.location.href = '/dang-nhap';
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }
  access_token = localStorage.getItem("access_token")
  user_name = localStorage.getItem("user_name")

 
  registerNavigate() {
    window.location.href = '/dang-ki'
  }
  loginNavigate() {
    window.location.href = '/dang-nhap'
  }
  searchBoth() {

  }
  homeNav() {
    window.location.href = '/trang-chu'
  }
  savedNav(){
    window.location.href ='/hoc-bong/da-luu'
  }
  universityNav() {
    window.location.href = '/truong-hoc'
  }
  scholarshipsNav() {
    window.location.href = '/hoc-bong'
  }
  navDetail(id: number) {
    window.location.href = `/hoc-bong/chi-tiet?id=${id}`;
  }
}
