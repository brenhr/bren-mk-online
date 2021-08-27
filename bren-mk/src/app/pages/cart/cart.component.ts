import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from '@angular/router';
import { ColorService } from '../../services/color.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { ItemService } from '../../services/item.service';
import { SizeService } from '../../services/size.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
	userInfo: any;
	id: string = "";
	colorId: string = "";
	color: string = "";
	sizeId: string ="";
	size: string = "";
	quantity: string ="";
	totalOrders: string="";
	totalItems: string="";
	order: any;
	itemDetails: any[];


  constructor(public authService: AuthService,
  			  private route: ActivatedRoute,
  			  private customerService: CustomerService,
              private orderService: OrderService,
              private itemService: ItemService,
              private productService: ProductService,
              private colorService: ColorService,
              private sizeService: SizeService
  			) {
  	this.itemDetails =[];
  }

  ngOnInit(): void {
  	this.route.paramMap.subscribe(params => {
  		this.id = params.get('id') || "";
  		this.colorId = params.get('id') || "";
  		this.sizeId = params.get('sizeId') ||"";
  		this.quantity = params.get('quantity') || "";

  		this.orderService.getTotalOrders().subscribe(response=>{
        let resp = JSON.parse(JSON.stringify(response));
  			this.totalOrders = resp.number.toString();
  		});

  		this.itemService.getTotalItems().subscribe(response =>{
        let resp = JSON.parse(JSON.stringify(response));
  			this.totalItems = resp.number.toString();
  		});

  		this.colorService.getColor(this.colorId).subscribe(response=> {
  			let resp = JSON.parse(JSON.stringify(response));
  			this.color = resp.name;
  		});

  		this.sizeService.getSize(this.sizeId).subscribe(response => {
  			let resp = JSON.parse(JSON.stringify(response));
  			this.size = resp.size;
  		});

  		if(!this.authService.isLoggedIn){
	  		this.authService.anonymousLogin().then(result=>{
	  			this.userInfo = JSON.parse(localStorage.getItem('user')  || '{}');
          console.log(this.userInfo);
          this.userInfo = this.userInfo.user;
	  			if(!this.isEmpty(this.id) && !this.isEmpty(this.colorId) && !this.isEmpty(this.sizeId)){
	  				this.createOrder(this.id, this.colorId, this.sizeId, this.quantity);
	  			} else {
	  				this.retrieveOrder();
	  			}
	  		});
	  	} else {
	  		this.userInfo = JSON.parse(localStorage.getItem('user')  || '{}');
	  		if(!this.isEmpty(this.id) && !this.isEmpty(this.colorId) && !this.isEmpty(this.sizeId)){
          this.createOrder(this.id, this.colorId, this.sizeId, this.quantity);
        } else {
          this.retrieveOrder();
        }
	  	}
  	});
  }

  createOrder(id: string, colorId: string, sizeId: string, quantity: string) {
  	this.orderService.getOrderBySession(this.userInfo.uid).subscribe(response => {
  		let resp = JSON.stringify(response);
  		if(resp.length > 2){		
  			resp = this.setCharAt(resp.substring(4,resp.length), 0, "[");
  			resp = this.setCharAt(resp, resp.length-1, "]");
  			let respJson = JSON.parse(resp);
  			this.order = respJson[0];
  		} else {
  			this.order = {};
  		}
  		if(this.order.id != null){
  			this.createItem(this.order, id, colorId, sizeId, quantity);
  		} else {
  			this.order = {
  				orderId: this.createOrderId(), 
  				completed: false, 
  				uid: this.userInfo.uid, 
  				items:[], 
  				quantity: ""};
  			this.createItem(this.order, id, colorId, sizeId, quantity);
  		}
  	});
  }

  retrieveOrder(){
  	this.orderService.getOrderBySession(this.userInfo.uid).subscribe(response => {
  		let resp = JSON.stringify(response);
  		resp = this.setCharAt(resp.substring(4,resp.length), 0, "[");
  		resp = this.setCharAt(resp, resp.length-1, "]");
  		let respJson = JSON.parse(resp);
  		this.order = respJson[0];
  	});
  }

  createOrderId() {
  	let orderId= "OD00" + this.totalOrders;
  	return orderId;
  }

  isEmpty(str: string) {
  	return (!str || str.length === 0 );
  }

  createItem(order: any, productId: string, colorId: string, sizeId: string, quantity: string) { 	
  	let item = {itemId: this.generateItemId(), color: this.color, size: this.size, product: {id: this.id}};
  	this.itemService.registerItem(this.totalItems, this.userInfo.stsTokenManager.accessToken, item).subscribe(response=>{
  		this.itemService.patchItem(this.totalItems, this.userInfo.stsTokenManager.accessToken, {id: this.totalItems}).subscribe(response=>{
  			let currentId = parseInt(this.totalItems);
  			currentId = currentId +1;
  			this.itemService.patchTotalItems(this.userInfo.stsTokenManager.accessToken, {number: currentId.toString()}).subscribe();
  			if(order.items.length > 0){
		  		for(let i=0; i<order.items.length; i++) {
			  		this.itemDetails.push(order.items[i]);
			  	}
			  	this.itemDetails.push({id: this.totalItems});

			  	let orderItems = {
			  		items: this.itemDetails, 
			  		quantity: this.itemDetails.length.toString()
			  	};
			  	this.orderService.patchOrder(order.id, this.userInfo.stsTokenManager.accessToken, orderItems).subscribe(res =>{
			  		this.refreshOrderDetails();
            let total = 0.0;
            for(let i =0; i<this.itemDetails.length; i++) {
              this.productService.getProductDetail(this.itemDetails[i].product.id).subscribe(response=> {
                let resp = JSON.parse(JSON.stringify(response));
                total += parseFloat(resp.price);
                this.orderService.patchOrder(order.id, this.userInfo.stsTokenManager.accessToken, {total: total}).subscribe(respPatchOrder=>{
                  this.order.price = total;
                  
                });
              });
            }
            this.refreshOrderDetails();
			  	});
		  	} else {
		  		this.itemDetails.push(item);
		  		order.items = [{id: this.totalItems}];
		  		order.quantity = this.itemDetails.length.toString();
		  		this.orderService.registeOrder(this.totalOrders, this.userInfo.stsTokenManager.accessToken, order).subscribe(response=> {
		  			this.orderService.patchOrder(this.totalOrders, this.userInfo.stsTokenManager.accessToken, {id: this.totalOrders}).subscribe(res =>{
		  				let currentId = parseInt(this.totalOrders);
		  				currentId = currentId +1;
		  				this.orderService.patchTotalOrders(this.userInfo.stsTokenManager.accessToken, {number: currentId.toString()}).subscribe(respOrder=>{
                let total = 0.0;
                for(let i =0; i<this.itemDetails.length; i++) {
                  this.productService.getProductDetail(this.itemDetails[i].product.id).subscribe(response=> {
                    let resp = JSON.parse(JSON.stringify(response));
                    total += parseFloat(resp.price);
                    this.orderService.patchOrder(this.totalOrders, this.userInfo.stsTokenManager.accessToken, {total: total}).subscribe(respPatchOrder=>{
                      this.order.price = total;
                    });
                  });
                }
                this.refreshOrderDetails();
              });
		  			});
		  		});
		  	}
		  	
  		});
  	});
  }

  generateItemId() {
  	let itemId = "IT00" + this.totalItems;
  	return itemId;
  }

  refreshOrderDetails() {
  	this.orderService.getOrderBySession(this.userInfo.uid).subscribe(orderResponse =>{
      console.log(this.userInfo.uid);
  		let resp = JSON.stringify(orderResponse);
      console.log(resp);
  		resp = this.setCharAt(resp.substring(4,resp.length), 0, "[");
  		resp = this.setCharAt(resp, resp.length-1, "]");
  		let respJson = JSON.parse(resp);
  		this.order = respJson[0];
  		let items = this.order.items;
  		for(let i=0; i< items.length; i++) {
        this.itemService.getItem(items[i].id).subscribe(response =>{
          let resp = JSON.parse(JSON.stringify(response));
          let arrayItems: any[];
          arrayItems =[];
          arrayItems.push(resp);
          for(let j=0; j < arrayItems.length; j ++){
            arrayItems[j].productDetail = {};
            this.itemDetails = [];
            this.productService.getProductDetail(arrayItems[j].product.id).subscribe(response =>{
              arrayItems[j].productDetail = response;
              this.itemDetails.push(arrayItems[j]);
              console.log(this.itemDetails);
              console.log(this.order);
            });
          }
        });
      }
    });
  }

  setCharAt(str: string,index: number,chr: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }
}
