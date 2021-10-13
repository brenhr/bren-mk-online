import { Detail } from '../models/detail';
import { Image } from '../models/image';
import { Color } from '../models/color';
import { Size } from '../models/size';

export class Product {
	key?: string;
	brandId?: string;
	categoryId?: string;
	description?: string;
	details?: Detail[];
	images?: Image[];
	keywords?: string[];
	model?: string;
	price?: string;
	name?: string;
	sizes?: Size[];
	colors?: Color[];
	mainImage?: string;
}
