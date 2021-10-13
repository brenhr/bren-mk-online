import { Order } from '../models/order';
import { Address } from '../models/address';


export class Customer {
	key?: string | null;
	email?: string;
	firstname?: string;
	lastname?: string;
	profilepicture?: string;
	role?: string;
	username?: string;
	address?: Address[];
	orders?: Order[];
}