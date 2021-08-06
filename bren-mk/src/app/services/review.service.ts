import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class ReviewService {

	private api:string = 'https://bren-mk-online-default-rtdb.firebaseio.com/';

	constructor(private http:HttpClient) {

	}

	getRewiews(){
		return this.http.get(`${this.api}review.json`);
	}

	registerReview(idToken:string, body:object){
		return this.http.post(`${this.api}/review.json?auth=${token}`, body);
	}

	patchReview(id:string, token:string, value:object){
		return this.http.patch(`${this.api}review/${id}.json?auth=${token}`,value);
	}

	getReviewDetail(id:string){
		return this.http.get(`${this.api}review/${id}.json`);
	}
}