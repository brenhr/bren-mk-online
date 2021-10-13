import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Customer } from '../utils/models/customer';

@Injectable({
	providedIn: 'root',
})

export class CustomerService {

	private dbPath = '/customer';

	customerRef: AngularFireList<Customer>;

	constructor(private http:HttpClient,
				private db: AngularFireDatabase) {

		this.customerRef = db.list(this.dbPath);

	}

	getCustomers(): AngularFireList<Customer> {
		return this.customerRef;
	}

	createOrUpdateCustomer(id: string, customer: Customer) {
		return this.db.list(this.dbPath).set(id, customer);
	}

	delete(id: string) {
		return this.customerRef.remove(id);
	}

	getCustomerByUid(uid: string): Observable<any> {

		return this.db.object(this.dbPath + "/" + uid).snapshotChanges();
	}

}