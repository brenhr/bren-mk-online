import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Item } from '../utils/models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

	private dbPath = '/item';

	itemRef: AngularFireList<Item>;

	constructor(private http:HttpClient,
				private db: AngularFireDatabase) {

		this.itemRef = db.list(this.dbPath);
	}

	getItems(): AngularFireList<Item> {
		return this.itemRef;
	}

	createItem(item: Item, id: string) {
		return this.db.list(this.dbPath).set(id, item);
	}

	update(id: string, value: any) {
		return this.itemRef.update(id, value);
	}

	delete(id: string) {
		return this.itemRef.remove(id);
	}

}
