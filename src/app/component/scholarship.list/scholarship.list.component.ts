import { Component, OnInit } from '@angular/core';
import { ScholashipResponse } from '../../response/scholarship.response';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
} from 'rxjs';
import { ScholashipService } from '../../service/scholarship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../../response/base.response';
import { enviroment } from '../../enviroment/enviroment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scholarship.list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scholarship.list.component.html',
  styleUrl: './scholarship.list.component.css',
})
export class ScholarshipListComponent implements OnInit {
navDetail(id:number) {
  window.location.href = `/hoc-bong/chi-tiet?id=${id}`
}
  scholarships: ScholashipResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  limit: number = 10;
  pages: number[] = [];
  totalsPages: number = 0;
  visiblePages: (number | string)[] = [];
  totalScholarships: number = 0;
  scholarshipOptions: ScholashipResponse[] = [];
  searchTerms: Subject<string> = new Subject<string>();
  searchTerms2: Subject<string> = new Subject<string>();
  countryCode: string = '';
  fosId: string = '';
  showDropdown: boolean = false;
  selectedDisciplineId: string | null = null;
  constructor(
    private scholarshipService: ScholashipService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'] || 1;
      this.keyword = params['keyword'] || '';
      this.fosId = params['discipline'] || '';
      this.currentPage = page;
      this.searchSchoolarship(
        this.keyword,
        this.countryCode,
        this.fosId,
        this.currentPage,
        this.limit
      );
    });
    this.searchTerms
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((term) => this.searchScholarshipsOnChange(term))
      )
      .subscribe(
        (data: any) => {
          this.scholarshipOptions = data.results;
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
  selectScholarship(id: number): void {
    console.log(id);
  }
  searchSchoolarship(
    keyword: string,
    countryCode: string,
    fosId: string,
    currentPage: number,
    limit: number
  ) {
    this.scholarshipService
      .getScholarships(keyword, countryCode, fosId, currentPage, limit)
      .subscribe({
        next: (response) => {
          this.scholarships = response.results;
          this.totalsPages = response.totalPages;
          this.totalScholarships = response.totalItems;

          this.scholarships = this.scholarships.map((scholarship) => ({
            ...scholarship,
            grantAmount: this.shortenAmount(scholarship.grantAmount),
            name: this.shortenText(scholarship.name),
            schoolName: this.shortenText(scholarship.schoolName),
            countryName: this.shortenText(scholarship.countryName),
          }));
          console.log(this.scholarships);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  searchScholarshipsOnChange(term: string) {
    if (term) {
      return this.http
        .get<BaseResponse<ScholashipResponse>>(
          `${enviroment.apiBaseUrl}/scholarship?keyword=${term}`
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
  shortenText(text: string, maxLength: number = 40): string {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text || '';
  }
  shortenAmount(text: string): string {
    if (text == 'Award Amount Varies' || text == null) {
      return 'Unknown';
    }
    return text || '';
  }

  search() {
    this.searchSchoolarship(this.keyword,this.countryCode,this.fosId,this.currentPage,this.limit)
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalsPages) {
      this.currentPage = page;
      this.searchSchoolarship(
        this.keyword!,
        this.countryCode,
        this.fosId,
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
  searchByDiscipline(id: string) {
    this.fosId = id;
    this.selectedDisciplineId = id;
    this.search();
  }

  onCountryChange(country: string): void {
    if (this.countryCode === country) {
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
      window.location.href = `/hoc-bong?page=${page}`;
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      window.location.href = `/hoc-bong?page=${Number(this.currentPage - 1)}`;
    }
  }
  schoolDetail(id: number) {
    window.location.href = `/hoc-bong/chi-tiet?id=${id}`;
  }
}
