import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentityToolkitService {

	signUpUri: string = environment.endpoints.signUp;
	verifyEmailUri: string = environment.endpoints.verifyEmail;
	apiKey: string = environment.firebase.apiKey;

	constructor(private http:HttpClient) {}

	registerUser(body:object){
		return this.http.post(`${this.signUpUri+this.apiKey}`, body);
	}

	sendVerificationEmail(body: object) {
		return this.http.post(`${this.verifyEmailUri+this.apiKey}`, body);
	}
}
