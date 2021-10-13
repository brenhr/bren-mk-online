import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../utils/models/product'

@Injectable({
	providedIn: 'root',
})
export class ProductService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient,
				private firestore: AngularFirestore) {

	}

	getProducts(): AngularFirestoreCollection<Product>{
		return this.firestore.collection('product');
	}

	registerProduct(body: Product): Promise<any>{
		return this.firestore.collection('product').add({... body});
	}

	getProduct(id:string): Observable<any> {
		return this.firestore.collection('product').doc(id).valueChanges();
	}

	update(id: string, data: Product): Promise<any> {
		return this.firestore.collection('product').doc(id).update(data);
	}

	filterProducts(field: string, value: string): AngularFirestoreCollection<Product> {
		return this.firestore.collection('product', ref => ref.where(field, '==', value));
	}
}