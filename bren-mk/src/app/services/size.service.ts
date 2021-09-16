import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) { }

	getSizes(){
		return this.http.get(`${this.databaseURI}/size.json`);
	}

	getSize(id: string){
		return this.http.get(`${this.databaseURI}/size/${id}.json`);
	}

	registerSize(idToken:string, body:object){
		return this.http.post(`${this.databaseURI}/size.json?auth=${idToken}`, body);
	}

	patchSize(id:string, idToken:string, value:object){
		return this.http.patch(`${this.databaseURI}/size/${id}.json?auth=${idToken}`, value);
	}

	
}
