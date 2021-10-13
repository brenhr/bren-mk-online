import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Size } from '../utils/models/size';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient,
				private firestore: AngularFirestore) { }

	getSizes(): AngularFirestoreCollection<Size> {
		return this.firestore.collection('size');
	}

	registerSize(idToken:string, body: Size){
		return this.firestore.collection('size').add({... body});
	}

	getSize(id:string): Observable<any> {
		return this.firestore.collection('size').doc(id).valueChanges();
	}
}
