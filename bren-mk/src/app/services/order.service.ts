import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})

export class OrderService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) {

	}

	getOrders(){
		return this.http.get(`${this.databaseURI}/order.json`);
	}

	getOrder(id: string){
		return this.http.get(`${this.databaseURI}/order/${id}.json`);
	}

	getOrderBySession(uid: string) {
		return this.http.get(`${this.databaseURI}/order.json?orderBy="uid"&equalTo="${uid}"&print=pretty`);
	}

	registeOrder(id: string, idToken:string, body:object){
		return this.http.patch(`${this.databaseURI}/order/${id}.json?auth=${idToken}`, body);
	}

	patchOrder(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/order/${id}.json?auth=${idToken}`,value);
	}

	getTotalOrders() {
		return this.http.get(`${this.databaseURI}/totalOrders.json`);
	}

	patchTotalOrders(idToken: string, number: any){
		return this.http.patch(`${this.databaseURI}/totalOrders.json?auth=${idToken}`, number);
	}
}