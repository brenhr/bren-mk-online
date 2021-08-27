import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})

export class CustomerService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) {

	}

	getUser(id: string){
		return this.http.get(`${this.databaseURI}/customer/${id}.json`);
	}

	getUserByEmail(email: string) {
		return this.http.get(`${this.databaseURI}/customer.json?orderBy="email"&equalTo="${email}"&print=pretty`);
	}

	registerUser(id: string, body:object){
		return this.http.patch(`${this.databaseURI}/customer/${id}.json`, body);
	}

	patchUser(id:string, value:object){
		return this.http.patch(`${this.databaseURI}/customer/${id}.json`,value);
	}

	getUserDetail(id:string){
		return this.http.get(`${this.databaseURI}/customer/${id}.json`);
	}

	getTotalCustomers() {
		return this.http.get(`${this.databaseURI}/totalCustomers.json`);
	}

	patchTotalCustomer(number: any){
		return this.http.patch(`${this.databaseURI}/totalCustomers.json`, number);
	}

}