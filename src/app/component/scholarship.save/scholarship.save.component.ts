import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { ScholashipService } from '../../service/scholarship.service';
import { ScholashipResponse } from '../../response/scholarship.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scholarship.save',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scholarship.save.component.html',
  styleUrl: './scholarship.save.component.css'
})
export class ScholarshipSaveComponent implements OnInit {
  scholarships: ScholashipResponse[] = []
  constructor(private alert: SweetAlertService,
    private scholarshipService: ScholashipService
  ) {

  }
  ngOnInit(): void {
    this.loadView()
  }
  loadView() {
    this.scholarshipService.getSavedScholarships().subscribe({
      next: (response) => {
        this.scholarships = response.results.map(s => ({
          ...s,
          updatedAt: new Date(s.updatedAt)
        }));
      }
    });
  }
  selectScholarship(id: number): void {
    window.location.href = `/hoc-bong/chi-tiet?id=${id}`;
  }
  schoolDetail(id: number) {
    window.location.href = `/truong-hoc/chi-tiet?id=${id}`;
  }
  getTimeAgo(updatedAt: Date): string {

    const now = new Date();
    const diffMs = now.getTime() - updatedAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `Cập nhật ${months} tháng trước`;
    if (weeks > 0) return `Cập nhật ${weeks} tuần trước`;
    if (days > 0) return `Cập nhật ${days} ngày trước`;
    if (hours > 0) return `Cập nhật ${hours} giờ trước`;
    if (minutes > 0) return `Cập nhật ${minutes} phút trước`;
    return 'Cập nhật mới đây';
  }


}
