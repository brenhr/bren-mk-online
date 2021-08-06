import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ProductService {

	private api:string = 'https://bren-mk-online-default-rtdb.firebaseio.com/';

	constructor(private http:HttpClient) {

	}

	getProducts(){
		return this.http.get(`${this.api}product.json`);
	}

	registerProduct(idToken:string, body:object){
		return this.http.post(`${this.api}/product.json?auth=${token}`, body);
	}

	patchProduct(id:string, token:string, value:object){
		return this.http.patch(`${this.api}product/${id}.json?auth=${token}`,value);
	}

	getProductDetail(id:string){
		return this.http.get(`${this.api}product/${id}.json`);
	}
}