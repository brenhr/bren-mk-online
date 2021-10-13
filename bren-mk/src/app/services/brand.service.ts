import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Brand } from '../utils/models/brand';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root',
})
export class BrandService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient,
				private firestore: AngularFirestore) {

	}

	getBrands(): AngularFirestoreCollection<Brand> {
		return this.firestore.collection('brand');
	}

	registerBrand(idToken: string, body: Brand): Promise<any> {
		return this.firestore.collection('brand').add({... body});
	}

	getBrand(id:string): Observable<any>{
		return this.firestore.collection('brand/' + id).valueChanges();
	}
}