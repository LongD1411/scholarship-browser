import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SchoolService } from '../../service/school.service';
import { FormsModule } from '@angular/forms';
import { SchoolResponse } from '../../response/school.respone';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { BaseResponse } from '../../response/base.response';
import { enviroment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-field.of.study',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './school.list.component.html',
  styleUrl: './school.list.component.css',
  
})
export class SchoolListComponent implements OnInit {
  schools: SchoolResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  limit: number = 10;
  pages: number[] = [];
  totalsPages: number = 0;
  visiblePages: (number | string)[] = [];
  totalSchools: number = 0;
  schoolOptions: SchoolResponse[] = [];
  searchTerms: Subject<string> = new Subject<string>();
  searchTerms2: Subject<string> = new Subject<string>();
  countryCode: string = '';
  showDropdown: boolean = false;
  constructor(
    private schoolService: SchoolService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'] || 1;
      this.keyword = params['keyword'] || '';
      this.currentPage = page;
      this.searchSchools(
        this.keyword,
        this.countryCode,
        this.currentPage,
        this.limit
      );
    });
    this.searchTerms
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((term) => this.searchSchoolsOnChange(term))
      )
      .subscribe(
        (data: any) => {
          this.schoolOptions = data.results;
        },
        (error: any) => {
          console.error('Error fetching schools:', error);
        }
      );
  }
  searchTerm: string = '';
  filteredUniversities: string[] = [];

  onSearch(event: Event): void {
    if (this.keyword.trim()) {
      this.showDropdown = true;
      const value = (event.target as HTMLInputElement).value;
      this.keyword = value;
      this.searchTerms.next(value);
      console.log('Searching for:', this.keyword);
    } else {
      this.showDropdown = false;
    }
  }
  closeDropdown() {
    this.showDropdown = false; // Đóng dropdown
  }
  selectUniversity(id: number): void {
    console.log(id);
  }
  searchSchools(
    keyword: string,
    countryCode: string,
    currentPage: number,
    limit: number
  ) {
    this.schoolService
      .getSchools(keyword, countryCode, currentPage, limit)
      .subscribe({
        next: (response) => {
          this.schools = response.results;
          this.totalsPages = response.totalPages;
          this.totalSchools = response.totalItems;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  searchSchoolsOnChange(term: string) {
    if (term) {
      return this.http
        .get<BaseResponse<SchoolResponse>>(
          `${enviroment.apiBaseUrl}/school?keyword=${term}`
        )
        .pipe(
          catchError((error) => {
            console.error('Error fetching schools:', error);
            return [];
          })
        );
    }
    return [];
  }

  search() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: this.keyword,
        countryCode: this.countryCode,
        page: this.currentPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalsPages) {
      this.currentPage = page;
      this.searchSchools(
        this.keyword!,
        this.countryCode,
        this.currentPage,
        this.limit
      );
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge',
      });
    }
  }
  changePageIfValid(page: string | number): void {
    if (typeof page === 'number') {
      this.changePage(page);
    }
  }

  onCountryChange(country: string): void {
    if (this.countryCode == country) {
      this.countryCode = '';
    } else {
      this.countryCode = country;
    }
    this.search();
  }
  navigateNewSchool() {
    window.location.href = '/truong-hoc/chinh-sua';
  }
  viewSchool(id: number) {
    window.location.href = `/truong-hoc/chi-tiet?id=${id}`;
  }
  nextPage() {
    if (this.currentPage < this.totalsPages) {
      const page = Number(this.currentPage) + 1;
      window.location.href = `/truong-hoc?page=${page}`;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      window.location.href = `/truong-hoc?page=${Number(this.currentPage - 1)}`;
    }
  }
  schoolDetail(id: number) {
    window.location.href = `/truong-hoc/chi-tiet?id=${id}`;
  }
}
