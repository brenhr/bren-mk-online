import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class BrandService {

	private api:string = 'https://bren-mk-online-default-rtdb.firebaseio.com/';

	constructor(private http:HttpClient) {

	}

	getData(){
		return this.http.get(`${this.api}brand.json`);
	}

	registerBrand(idToken:string, body:object){
		return this.http.post(`${this.api}/brand.json?auth=${token}`, body);
	}

	patchBrand(id:string, token:string, value:object){
		return this.http.patch(`${this.api}brand/${id}.json?auth=${token}`,value);
	}
}