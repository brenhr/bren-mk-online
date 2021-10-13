import { Review } from '../models/review';
import { Address } from '../models/address';
import { Status } from '../models/status';
import { Product } from '../models/product';

export class Item {
	key?: string;
	color?: string;
	size?: string;
	quantity?: string;
	itemId?: string;
	orderId?: string;
	productId?: string;
	review?: Review;
	address?: Address;
	lastStatus?: Status;
	productDetail?: Product;
}
