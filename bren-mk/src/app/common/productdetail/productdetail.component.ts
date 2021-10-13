import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ColorService } from '../../services/color.service';
import { SizeService } from '../../services/size.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Size } from '../../utils/models/size';
import { Color } from '../../utils/models/color';
import { Product } from '../../utils/models/product';
import { Detail } from '../../utils/models/detail';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
	id: string;
	productDetail?: Product;
	selectedImage: any;
	availableColors: any[];
	availableSizes: any[];
	details?: Detail [];
	selectedColor: string;
	selectedColorId: string;
	selectedSize: string;
	selectedSizeId: string;
	selectedQuantity: string;
	infoAuth: any;
	allSizes?: Size[];
	allColors?: Color[];

	constructor(private route: ActivatedRoute, 
				private productService: ProductService, 
				private colorService: ColorService,
				private sizeService: SizeService,
				private analytics: AngularFireAnalytics) {
		this.id="";
		this.availableColors = [];
		this.availableSizes = [];
		this.selectedColor = "";
		this.selectedColorId = "";
		this.selectedSize = "";
		this.selectedSizeId ="";
		this.selectedQuantity = "";
		this.details = [];
		this.infoAuth = JSON.parse(localStorage.getItem('user')  || '{}');
	}

	ngOnInit(): void {
		this.availableColors = [];
		this.availableSizes =[]
		this.route.paramMap.subscribe(params => {
			this.id = params.get('id') || "";
			console.log(this.id);
			this.getCatalogs();
			this.getProductDetail();
		});
	}

	getCatalogs() {
		this.sizeService.getSizes().snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => 
	          ({key: c.payload.doc.id, ... c.payload.doc.data()})
	        )
	      )
	    ).subscribe(data => {
	    	console.log(data);
	      this.allSizes = data;
	      this.selectedSizeId = this.allSizes[0].key as string;
	    });

		this.colorService.getColors().snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => 
	          ({key: c.payload.doc.id, ... c.payload.doc.data()})
	        )
	      )
	    ).subscribe(data => {
	      this.allColors = data;
	      this.selectedColorId = this.allColors[0].key as string;
	    });
		this.selectedQuantity = "1";
	}

	getProductDetail() {
		this.productService.getProduct(this.id).subscribe((item: Product) =>{
			this.productDetail = item;
			this.productDetail.key = this.id;
			this.sendAnalyticsInfo();
			this.details = this.productDetail?.details;
			if(this.details != undefined) {
				this.details.forEach(detail => {
					let idColor = detail.color;
					let idSize = detail.size;
					this.getColorById(idColor as string);
					this.getSizeById(idSize as string);
				});
			}
		}, (error: any) => {
			console.log("Error: " + error);
		});
	}

	getColorById(idColor: string) {
		this.colorService.getColor(idColor).subscribe((item: Color) => {
			let color: Color = item;
			color.key = idColor;
			if(!this.colorExistsInArray(this.availableColors, color)) {
				this.availableColors.push(color);
			}
		}, (error: any) => {
			console.log("Error: " + error);
		});
	}

	getSizeById(idSize: string) {
		this.sizeService.getSize(idSize).subscribe((item: Size) => {
			let size: Size = item;
			size.key = idSize;
			if(!this.sizeExistsInArray(this.availableSizes, size)) {
				this.availableSizes.push(size);
			}
		}, (error: any) => {
			console.log("Error: " + error);
		});
	}

	sendAnalyticsInfo() {
		let infoAnalytics = {selectedProduct: {id: this.productDetail?.key, name: this.productDetail?.name}, user: "" };
		if(this.infoAuth.email !== undefined) {
			infoAnalytics.user = this.infoAuth.email;
		} else {
			infoAnalytics.user = "anonymous";
		}
		this.analytics.logEvent('selected_product', infoAnalytics);
	}

	selectImage(image: string | undefined) {
		this.selectedImage = image;
	}

	selectSize(e: Event) {
		this.selectedSize = (e.target as HTMLInputElement).value;
		console.log(this.selectedSize);
		this.selectedSizeId = this.findIdSize(this.selectedSize);
		console.log(this.selectedSizeId);
	}

	selectColor(color: string) {
		this.selectedColor = color;
		this.selectedColorId = this.findIdColor(color);
		console.log(this.selectedColorId);
	}

	colorExistsInArray(array: any[], obj: any) {
		for(let i = 0; i<= array.length; i++) {
			if(array[i] !== undefined && array[i].name === obj.name) {
				return true;
			}
		}
		return false;
	}

	sizeExistsInArray(array: any[], obj: any) {
		for(let i = 0; i<= array.length; i++) {
			if(array[i] !== undefined && array[i].size === obj.size) {
				return true;
			}
		}
		return false;
	}
	setQuantity(e: Event) {
		this.selectedQuantity = "1";
	}

	findIdColor(name: string): string {
		let colorId ="";
		this.allColors?.forEach(color => {
			if(color.name === name) {
				colorId = color.key as string;
			}
		});
		return colorId;
	}

	findIdSize(size: string): string {
		let sizeId ="";
		this.allSizes?.forEach(sizeVar =>{
			if(sizeVar.size === size) {
				sizeId = sizeVar.key as string;
			}
		});
		return sizeId;
	}
}