import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-login',
  imports: [FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    const success = this.authService.login(
      this.email,
      this.password
    );

    if (success) {

      this.router.navigate(['/cart']);

    } else {

      this.errorMessage =
        'Invalid email or password.';

    }
  }
}