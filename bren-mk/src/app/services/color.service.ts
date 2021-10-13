import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Color } from '../utils/models/color';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

	databaseURI: string = environment.firebase.databaseURL;

	constructor(private http:HttpClient,
				private firestore: AngularFirestore) { }

	getColors(): AngularFirestoreCollection {
		return this.firestore.collection('color');
	}

	registerColors(body: Color): Promise<any>{
		return this.firestore.collection('color').add({... body});
	}

	getColor(id:string): Observable<any>{
		return this.firestore.collection('color').doc(id).valueChanges();
	}
}
