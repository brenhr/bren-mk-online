import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class BrandService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) {

	}

	getBrands(){
		return this.http.get(`${this.databaseURI}/brand.json`);
	}

	registerBrand(idToken:string, body:object){
		return this.http.post(`${this.databaseURI}/brand.json?auth=${idToken}`, body);
	}

	patchBrand(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/brand/${id}.json?auth=${idToken}`, value);
	}
}