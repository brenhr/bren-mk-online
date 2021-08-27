import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) {

	}

	getItem(id: string){
		return this.http.get(`${this.databaseURI}/item/${id}.json`);
	}

	getItems() {
		return this.http.get(`${this.databaseURI}/item.json`);
	}

	registerItem(id: string, idToken:string, body:object){
		return this.http.patch(`${this.databaseURI}/item/${id}.json?auth=${idToken}`, body);
	}

	patchItem(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/item/${id}.json?auth=${idToken}`,value);
	}

	getTotalItems() {
		return this.http.get(`${this.databaseURI}/totalItems.json`);
	}

	patchTotalItems(idToken: string, number: any){
		return this.http.patch(`${this.databaseURI}/totalItems.json?auth=${idToken}`, number);
	}
}
