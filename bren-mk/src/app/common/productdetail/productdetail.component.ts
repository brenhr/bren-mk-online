import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ColorService } from '../../services/color.service';
import { SizeService } from '../../services/size.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
	id: string;
	productDetail: any;
	selectedImage: any;
	availableColors: any[];
	availableSizes: any [];
	details: any [];
	selectedColor: string;
	selectedColorId: string;
	selectedSize: string;
	selectedSizeId: string;
	selectedQuantity: string;
	infoAuth: any;
	allSizes: any[];
	allColors: any[];

	constructor(private route: ActivatedRoute, 
				private productService: ProductService, 
				private colorService: ColorService,
				private sizeService: SizeService,
				private analytics: AngularFireAnalytics) {
		this.id="";
		this.availableColors = [];
		this.availableSizes = [];
		this.allColors = [];
		this.allSizes =[];
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
			this.sizeService.getSizes().subscribe(result =>{
				let resp = JSON.parse(JSON.stringify(result));
				this.allSizes = resp;
				this.selectedSizeId = "0";
			});
			this.colorService.getColors().subscribe(result =>{
				let resp = JSON.parse(JSON.stringify(result));
				this.allColors = resp;
				this.selectedColorId = "0";
			});
			this.selectedQuantity = "1";
			this.productService.getProductDetail(this.id).subscribe(response => {
				this.productDetail = response;
				let resp = JSON.parse(JSON.stringify(response));
				let infoAnalytics = {selectedProduct: {id: resp.id, name: resp.name}, user: "" };
				if(this.infoAuth.email !== undefined) {
					infoAnalytics.user = this.infoAuth.email;
				} else {
					infoAnalytics.user = "anonymous";
				}
				this.analytics.logEvent('selected_product', infoAnalytics);
				this.selectedImage = resp.images[0].imagepath;
				this.details = resp.details;
				for(let i= 0; i<this.details.length; i++) {
					let idColor= this.details[i].color.id;
					let idSize = this.details[i].size.id;
					this.colorService.getColor(idColor).subscribe(response =>{
						if(!this.colorExistsInArray(this.availableColors, response)) {
							this.availableColors.push(response);
						}
						this.selectedColor = this.availableColors[0].name;
					});

					this.sizeService.getSize(idSize).subscribe(response => {
						if(!this.sizeExistsInArray(this.availableSizes, response)) {
							this.availableSizes.push(response);
						}
						this.selectedSize = this.availableSizes[0].size;
					});
				}
				
				
			});
		});
	}

	selectImage(image: string,) {
		this.selectedImage = image;
	}

	selectSize(e: Event) {
		this.selectedSize = (e.target as HTMLInputElement).value;
		this.selectedSizeId = this.findIdSize(this.selectedSize);
	}

	selectColor(color: string) {
		this.selectedColor = color;
		this.selectedColorId = this.findIdColor(color);
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
		let colorId ="-1";
		for(let i=0; i<this.allColors.length; i++){
			if(this.allColors[i].name === name){
				colorId = "" + i;
			}
		}
		return colorId;
	}

	findIdSize(size: string): string {
		let sizeId ="-1";
		for(let i=0; i<this.allSizes.length; i++){
			if(this.allSizes[i].size === size){
				sizeId = "" + i;
			}
		}
		return sizeId;
	}
}
