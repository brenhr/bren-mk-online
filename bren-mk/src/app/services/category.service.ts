import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) { }

	getCategories() {
		return this.http.get(`${this.databaseURI}/category.json`);
	}

	registerCategory(idToken: string, body: any){
		return this.http.post(`${this.databaseURI}/brand.json?auth=${idToken}`, body);
	}
}
