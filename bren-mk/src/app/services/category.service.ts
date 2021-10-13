import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../utils/models/category';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient,
				private firestore: AngularFirestore) { }

	getCategories(): AngularFirestoreCollection<Category> {
		return this.firestore.collection('category');
	}

	registerCategories(idToken: string, body: Category): Promise<any> {
		return this.firestore.collection('category').add({... body});
	}

	getCategory(id:string): Observable<any> {
		return this.firestore.collection('category/' + id).valueChanges();
	}
}
