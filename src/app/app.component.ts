import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
homeNav() {
window.location.href = '/trang-chu'
}
universityNav(){
  window.location.href = '/truong-hoc'
}
scholarshipsNav(){
  window.location.href = '/hoc-bong'
}
}
