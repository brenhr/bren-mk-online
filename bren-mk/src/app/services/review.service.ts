import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})

export class ReviewService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient) {

	}

	getRewiews() {
		return this.http.get(`${this.databaseURI}/review.json`);
	}

	registerReview(id: string, idToken:string, body:object) {
		return this.http.patch(`${this.databaseURI}/review/${id}.json?auth=${idToken}`, body);
	}

	patchReview(id:string, idToken:string, value:object) {
		return this.http.patch(`${this.databaseURI}/review/${id}.json?auth=${idToken}`,value);
	}

	getReviewDetail(id:string) {
		return this.http.get(`${this.databaseURI}/review/${id}.json`);
	}

	getTotalReviews() {
		return this.http.get(`${this.databaseURI}/totalReviews.json`);
	}

	patchTotalReviews(idToken: string, number: string){
		return this.http.patch(`${this.databaseURI}/totalReviews.json?auth=${idToken}`, number);
	}
}