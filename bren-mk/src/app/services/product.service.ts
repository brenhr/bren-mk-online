import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ProductService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) {

	}

	getProducts(){
		return this.http.get(`${this.databaseURI}/product.json`);
	}

	registerProduct(id: string, idToken:string, body:object){
		return this.http.patch(`${this.databaseURI}/product/${id}.json?auth=${idToken}`, body);
	}

	patchProduct(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/product/${id}.json?auth=${idToken}`,value);
	}

	getProductDetail(id:string){
		return this.http.get(`${this.databaseURI}/product/${id}.json`);
	}

	getProductsByLimit(infLimit: number, filter: number){
		return this.http.get(`${this.databaseURI}/product.json?orderBy="$key"&startAt="${infLimit}"&limitToFirst=${filter}`);
	}

	getTotalProducts() {
		return this.http.get(`${this.databaseURI}/totalProducts.json`);
	}

	patchTotalProducts(idToken: string, number: any){
		return this.http.patch(`${this.databaseURI}/totalProducts.json?auth=${idToken}`, number);
	}
}