import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) { }

	getColors(){
		return this.http.get(`${this.databaseURI}/color.json`);
	}

	getColor(id: string){
		return this.http.get(`${this.databaseURI}/color/${id}.json`);
	}

	registerColor(idToken:string, body:object){
		return this.http.post(`${this.databaseURI}/color.json?auth=${idToken}`, body);
	}

	patchColor(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/color/${id}.json?auth=${idToken}`, value);
	}
}
