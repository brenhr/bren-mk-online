import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class OrderService {

	private api:string = 'https://bren-mk-online-default-rtdb.firebaseio.com/';

	constructor(private http:HttpClient) {

	}

	getOrder(){
		return this.http.get(`${this.api}order.json`);
	}

	registeOrder(idToken:string, body:object){
		return this.http.post(`${this.api}/order.json?auth=${token}`, body);
	}

	patchOrder(id:string, token:string, value:object){
		return this.http.patch(`${this.api}order/${id}.json?auth=${token}`,value);
	}
}