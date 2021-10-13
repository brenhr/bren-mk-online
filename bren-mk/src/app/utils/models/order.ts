import { Address } from '../models/address';
import { Item } from '../models/item';
import { Status } from '../models/status';

export class Order {
	key?: string;
	address?: Address;
	completed?: boolean;
	date?: string;
	orderId?: string;
	items?: Item[];
	paymentId?: string;
	quantity?: string;
	status?: Status[];
	total?: string;
	trackingnumber?: string;
}
