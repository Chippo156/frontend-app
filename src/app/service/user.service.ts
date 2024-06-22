import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterDto } from '../dtos/registerDto';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dtos/loginDto';
import { UserResponse } from '../responses/userResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiRegister = `${environtment.apiBaseUrl}/users/register`;
  private apiLogin = `${environtment.apiBaseUrl}/users/login`;
  private apiConfig = {
    headers: this.createHeaders(),
  };
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
      Authorization: '',
    });
  }
  constructor(private http: HttpClient) {}

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(this.apiRegister, registerDto, this.apiConfig);
  }

  login(loginDto: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDto, this.apiConfig);
  }
  getUserDetails(token: string): Observable<any> {
    return this.http.get(`${environtment.apiBaseUrl}/users/details`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  saveUserResponseToLocalStorage(userResponse: UserResponse) {
    try {
      const userResponseJson = JSON.stringify(userResponse);
      localStorage.setItem('user', userResponseJson);
      console.log('User response saved to local storage');
    } catch (e) {
      console.log('Error saving user response to local storage');
    }
  }
  getUserResponseFromLocalStorage(): UserResponse | undefined {
    try {
      const userResponseJson = localStorage.getItem('user');
      if (userResponseJson === null || userResponseJson == undefined)
        return undefined;
      const userResponse: UserResponse = JSON.parse(userResponseJson);
      return userResponse;
    } catch (e) {
      console.log('Error getting user response from local storage');
      return undefined;
    }
  }
  removeUserResponseFromLocalStorage() {
    try {
      localStorage.removeItem('user');
      console.log('User response removed from local storage');
    } catch (e) {
      console.log('Error removing user response from local storage');
    }
  }
}
