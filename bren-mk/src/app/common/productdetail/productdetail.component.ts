import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ColorService } from '../../services/color.service';
import { SizeService } from '../../services/size.service';

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
	selectedSize: string;
	selectedQuantity: string;
	constructor(private route: ActivatedRoute, 
				private productService: ProductService, 
				private colorService: ColorService,
				private sizeService: SizeService) {
		this.id="";
		this.availableColors = [];
		this.availableSizes = [];
		this.selectedColor = "";
		this.selectedSize = "";
		this.selectedQuantity = "";
		this.details = [];
	}

	ngOnInit(): void {
		this.availableColors = [];
		this.availableSizes =[]
		this.route.paramMap.subscribe(params => {
			this.id = params.get('id') || "";

			this.productService.getProductDetail(this.id).subscribe(response => {
				this.productDetail = response;
				let resp = JSON.parse(JSON.stringify(response));
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
	}

	selectColor(color: string) {
		this.selectedColor = color;
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
		this.selectedQuantity = (e.target as HTMLInputElement).value;
	}
}
