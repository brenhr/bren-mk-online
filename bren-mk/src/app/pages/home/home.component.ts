import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { ColorService } from '../../services/color.service';
import { ProductService } from '../../services/product.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Color } from '../../utils/models/color';
import { Brand } from '../../utils/models/brand';
import { Category } from '../../utils/models/category';
import { Product } from '../../utils/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	categories: any;
	brands?: Brand[];
	colors?: Color[];
	products: any;
	rowProducts: any;
	groupProducts: any[];
	arrayProducts?: Product[];
	totalProducts: number;
	totalColumns: number;
	totalRows: number;
	infoAuth: any;

	constructor(public authService: AuthService, 
				private categoryService: CategoryService,
				private brandService: BrandService,
				private colorService: ColorService,
				private productService: ProductService,
				private analytics: AngularFireAnalytics) {
		this.rowProducts = [];
		this.groupProducts =[];
		this.totalProducts = 0;
		this.totalColumns = 3;
		this.totalRows = 0;
		this.infoAuth = JSON.parse(localStorage.getItem('user')  || '{}');
		if(this.infoAuth.email !== 'undefined'){
			let analyticsInfo = {user: "anonymous"};
			analytics.logEvent('user_anonymous', analyticsInfo);
		} else {
			let analyticsInfo = {user: this.infoAuth.email};
			analytics.logEvent('user_registered', analyticsInfo);
		}
	}

	ngOnInit(): void {
		this.populatePage();
	}

	getAllProducts(){

		this.productService.getProducts().snapshotChanges().pipe(
			map(changes =>
				changes.map(c =>
					({key: c.payload.doc.id, ... c.payload.doc.data()})
				)
			)
		).subscribe((data)=>{
			this.arrayProducts = data;
			console.log(this.arrayProducts);
			this.totalProducts = this.arrayProducts.length;
			this.totalRows = Math.floor(this.totalProducts / this.totalColumns);
			this.totalProducts % this.totalColumns > 0 ? 
				this.totalRows = this.totalRows + 1: this.totalRows = this.totalRows;
			let index =0;
			for(var i = 0; i < this.totalRows; i++) {
				for(var j = 0; j < this.totalColumns; j++) {
					if(data[index] != null) {
						this.groupProducts.push(data[index]);
					} else {
						this.groupProducts.push({})
					}
					index ++;
				}
				this.rowProducts[i] = {products: []};
				this.rowProducts[i].products = this.groupProducts;
				this.groupProducts = [];
			}
		});
	}

	getAllColors() {
		this.colorService.getColors().snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => 
	          ({key: c.payload.doc.id, ... c.payload.doc.data()})
	        )
	      )
	    ).subscribe(data => {
	      this.colors = data;
	    });
	}

	getAllBrands() {
		this.brandService.getBrands().snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => 
	          ({key: c.payload.doc.id, ... c.payload.doc.data()})
	        )
	      )
	    ).subscribe(data => {
	      this.brands = data;
	    });
	}

	getAllCategories() {
		this.categoryService.getCategories().snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => 
	          ({key: c.payload.doc.id, ... c.payload.doc.data()})
	        )
	      )
	    ).subscribe(data => {
	      this.categories = data;
	    });
    }

	populatePage() {
		this.getAllCategories();
		this.getAllBrands();
		this.getAllColors();
		this.getAllProducts();
	}

	filterProducts(fieldId: string, value: string) {
		var element = <HTMLInputElement> document.getElementById(value);
		let ischecked = element.checked;
		if(ischecked) {
			this.rowProducts = [];
			this.groupProducts =[];
			console.log(fieldId);
			console.log(value);
			this.productService.filterProducts(fieldId, value).snapshotChanges().pipe(
		      map(changes =>
		        changes.map(c => 
		          ({key: c.payload.doc.id, ... c.payload.doc.data()})
		        )
		      )
		    ).subscribe((data)=>{
				this.arrayProducts = data;
				console.log(this.arrayProducts);
				this.totalProducts = this.arrayProducts.length;
				this.totalRows = Math.floor(this.totalProducts / this.totalColumns);
				this.totalProducts % this.totalColumns > 0 ? 
					this.totalRows = this.totalRows + 1: this.totalRows = this.totalRows;
				let index =0;
				for(var i = 0; i < this.totalRows; i++) {
					for(var j = 0; j < this.totalColumns; j++) {
						if(data[index] != null) {
							this.groupProducts.push(data[index]);
						} else {
							this.groupProducts.push({})
						}
						index ++;
					}
					this.rowProducts[i] = {products: []};
					this.rowProducts[i].products = this.groupProducts;
					this.groupProducts = [];
				}
			});
		} else {
			this.getAllProducts();
		}
		
	}

}
