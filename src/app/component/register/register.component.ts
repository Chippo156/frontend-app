import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { RegisterDto } from '../../dtos/registerDto';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  phoneNumber: string;
  password: string;
  password_confirm: string;
  name: string;
  address: string;
  date_of_birth: Date;

  constructor(private router: Router, private userSerrvice: UserService) {
    this.phoneNumber = '';
    this.password = '';
    this.password_confirm = '';
    this.name = 'Võ Văn Nghĩa Hiệp';
    this.address = '113 võ duy ninh';
    this.date_of_birth = new Date();
  }
  onPhoneChange() {
    console.log(`Phone number: ${this.phoneNumber}`);
  }
  register() {
    const registerDto: RegisterDto = {
      fullname: this.name,
      phone_number: this.phoneNumber,
      address: this.address,
      password: this.password,
      retype_password: this.password_confirm,
      date_of_birth: this.date_of_birth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 2,
    };
    this.userSerrvice.register(registerDto).subscribe({
      next: (response: any) => {
        if (response !== null && response.Status === 200) {
          alert('Register success');
          this.router.navigate(['/login']);
        } else {
          console.log('Register failed');
        }
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  checkPassword() {
    if (this.password !== this.password_confirm) {
      this.registerForm.form.controls['password_confirm'].setErrors({
        invalidPassword: true,
      });
    } else {
      this.registerForm.form.controls['password_confirm'].setErrors(null);
    }
  }

  checkAge() {
    const currentDate = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate < birthDate)) {
      age--;
    }
    if (age < 18) {
      this.registerForm.form.controls['date_of_birth'].setErrors({
        invalidAge: true,
      });
    } else {
      this.registerForm.form.controls['date_of_birth'].setErrors(null);
    }
  }
}
