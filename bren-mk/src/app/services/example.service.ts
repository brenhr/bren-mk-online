import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExampleService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) { }

	getExample(id: string){
		return this.http.get(`${this.databaseURI}/example/${id}.json`);
	}

	postExample(body: object){
		return this.http.post(`${this.databaseURI}/example.json`, body);
	}
}
