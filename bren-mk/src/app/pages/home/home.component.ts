import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { ColorService } from '../../services/color.service';
import { ProductService } from '../../services/product.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	categories: any;
	brands: any;
	colors: any;
	products: any;
	rowProducts: any;
	groupProducts: any[];
	totalProducts: number;
	totalColumns: number;
	totalRows: number;
	product: any;
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

		this.categoryService.getCategories().subscribe(response => {
			this.categories = response;
		});

		this.brandService.getBrands().subscribe(response => {
			this.brands = response;
		});

		this.colorService.getColors().subscribe(response => {
			this.colors = response;
		});

		this.getAllProducts();
		console.log(this.rowProducts);
	}

	getAllProducts() {
		this.productService.getTotalProducts().subscribe(response =>{
			let resp = JSON.parse(JSON.stringify(response));
			this.totalProducts = parseInt(resp.number.toString());
			this.totalRows = Math.floor(this.totalProducts / this.totalColumns);
			this.totalProducts % this.totalColumns > 0 ? 
				this.totalRows = this.totalRows + 1: this.totalRows = this.totalRows;
			this.productService.getProducts().subscribe(response => {
				let index = 0;
				let resp = JSON.parse(JSON.stringify(response));
				for(var i = 0; i < this.totalRows; i++) {
					for(var j = 0; j < this.totalColumns; j++) {
						this.product = resp[index];
						if(resp[index] != null && resp[index]!= 'undefined') {
							this.groupProducts.push(this.product);
						} else {
							this.groupProducts.push({});
						}
						index ++;
					}
					this.rowProducts[i] = {products: []};
					this.rowProducts[i].products = this.groupProducts;
					this.groupProducts = [];
				}
			});
		});
		
	}

}
