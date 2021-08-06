import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class CustomerService {

	private api:string = 'https://bren-mk-online-default-rtdb.firebaseio.com/';

	constructor(private http:HttpClient) {

	}

	registerUser(idToken:string, body:object){
		return this.http.post(`${this.api}/customer.json?auth=${token}`, body);
	}

	patchUser(id:string, token:string, value:object){
		return this.http.patch(`${this.api}customer/${id}.json?auth=${token}`,value);
	}

	getUserDetail(id:string){
		return this.http.get(`${this.api}customer/${id}.json`);
	}

}