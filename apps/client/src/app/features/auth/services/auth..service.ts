import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@events-app/endpoints';
import type { SignupRequestDto,
  SignupResponseDto,
  SigninRequestDto,
  SigninResponseDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
  ResendOtpRequestDto,
  ResendOtpResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@events-app/shared-dtos';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signup(data: SignupRequestDto): Observable<SignupResponseDto> {
    return this.http.post<SignupResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.auth.signup}`,
      data
    );
  }

  verifyOtp(data: VerifyOtpRequestDto): Observable<VerifyOtpResponseDto> {
    return this.http.post<VerifyOtpResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.auth.verifyOtp}`,
      data
    );
  }

  resendOtp(data: ResendOtpRequestDto): Observable<ResendOtpResponseDto> {
    return this.http.post<ResendOtpResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.auth.resendOtp}`,
      data
    );
  }

  signin(data: SigninRequestDto): Observable<SigninResponseDto> {
    return this.http.post<SigninResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.auth.signin}`,
      data
    );
  }

  forgotPassword(
    data: ForgotPasswordRequestDto
  ): Observable<ForgotPasswordResponseDto> {
    return this.http.post<ForgotPasswordResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.auth.forgotPassword}`,
      data
    );
  }

  resetPassword(
    resetToken: string,
    data: ResetPasswordRequestDto
  ): Observable<ResetPasswordResponseDto> {
    return this.http.post<ResetPasswordResponseDto>(
      `${this.baseUrl}${API_ENDPOINTS.auth.resetPassword(resetToken)}`,
      data
    );
  }
}
