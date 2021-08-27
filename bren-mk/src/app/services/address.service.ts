import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) { }

	getAddress(id: string){
		return this.http.get(`${this.databaseURI}/address/${id}.json`);
	}

	getAddressess() {
		return this.http.get(`${this.databaseURI}/address.json`);
	}

	registerAddress(idToken:string, body:object){
		return this.http.post(`${this.databaseURI}/address.json?auth=${idToken}`, body);
	}

	patchAdrress(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/address/${id}.json?auth=${idToken}`,value);
	}

}
