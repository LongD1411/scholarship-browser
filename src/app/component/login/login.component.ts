import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  registrationMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alert: SweetAlertService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const verifyStatus = params['verify'];

      if (verifyStatus === 'success') {
        this.alert.showSuccess("Xác minh thành công")
      } else if (verifyStatus === 'fail') {
        this.alert.showSuccess('Xác minh thất bại');
      }
    });
  }
  submitHandler() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.authService.login(loginData).subscribe({
        next: (response) => {
          const token = response.result.token;
          this.authService.setToken(token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem("user_name",payload.user_name);
          if (payload.scope && payload.scope.includes('ROLE_ADMIN')) {
            window.location.href = 'http://localhost:4300/trang-chu';  
            
          }
          if (payload.scope && payload.scope.includes('ROLE_USER')) {
            window.location.href = '/trang-chu';  
         
          }
        },
        error: (error) => {
          this.alert.showError(error.error.message);
        },
        complete: () => {},
      });
    } else {
      this.registrationMessage = 'Điền đúng định dạng các trường.';
    }
  }
  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }
  homeNavigate() {
    this.router.navigate(['/']);
  }
}
