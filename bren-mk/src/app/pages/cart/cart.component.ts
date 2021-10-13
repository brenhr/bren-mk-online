import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from '@angular/router';
import { ColorService } from '../../services/color.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { ItemService } from '../../services/item.service';
import { SizeService } from '../../services/size.service';
import { Color } from '../../utils/models/color';
import { Size } from '../../utils/models/size';
import { Customer } from '../../utils/models/customer';
import { Item } from '../../utils/models/item';
import { Order } from '../../utils/models/order';
import { Product } from '../../utils/models/product';


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
	order?: Order;
	itemDetails?: Item[];
  customerDetail?: Customer;
  arrayCustomer?: Customer[];
  addToCart?: boolean;
  refresh?: boolean;


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
  		this.colorId = params.get('colorId') || "";
  		this.sizeId = params.get('sizeId') ||"";
  		this.quantity = params.get('quantity') || "";
      if(!this.isEmpty(this.id) && !this.isEmpty(this.colorId) && !this.isEmpty(this.sizeId)){
        this.addToCart = true;
        this.sizeService.getSize(this.sizeId).subscribe((item: Size) => {
          console.log(item);
          let varSize: Size = item;
          varSize.key = this.sizeId;
          this.size = item.size as string;
        }, (error: any) => {
          console.log("Error: " + error);
        });

        this.colorService.getColor(this.colorId).subscribe((item: Color) => {
          console.log(item);
          let varColor: Color = item;
          varColor.key = this.colorId;
          this.color = item.name as string;
        }, (error: any) => {
          console.log("Error: " + error);
        });
      } else {
        this.refresh = true;
      }
      console.log(this.colorId);
      console.log(this.sizeId);
      

  		if(!this.authService.isLoggedIn){
        console.log("NoE= esta logueado");
	  		this.authService.anonymousLogin().then(result=>{
	  			this.userInfo = JSON.parse(localStorage.getItem('user')  || '{}');
          this.userInfo = this.userInfo.user;
          let anonymousCustomer: Customer = {
            email: "notProvided",
            firstname: "Anonymous",
            lastname: "Anonymous",
            profilepicture: "https://firebasestorage.googleapis.com/v0/b/bren-mk-online.appspot.com/o/assets%2Fprofile-default.png?alt=media&token=5a9b8d37-1ebd-4ba3-907f-c5e35a3e0b0b",
            role: "customer",
            username: this.userInfo.uid,
            address: [],
            orders: []
          };
          this.customerService.createOrUpdateCustomer(this.userInfo.uid, anonymousCustomer).then((result: any) =>{
            this.retrievecartInfo(this.userInfo.uid);
          });
	  		});
	  	} else {
        console.log("Esta logueado");
	  		this.userInfo = JSON.parse(localStorage.getItem('user')  || '{}');
        this.retrievecartInfo(this.userInfo.uid);
	  	}
  	});
  }

  createOrder(id: string, colorId: string, sizeId: string, quantity: string, customer: Customer) {
    console.log(customer);
    if(customer) {
      console.log("Cliente");
      console.log(customer);
      console.log(customer.orders);
      if(customer.orders){
        console.log("Hay ordenes");
        customer.orders.forEach(o =>{
          console.log(o);
          if(!o.completed){
            console.log("Orden no completada");
            this.order = o;
          }
        });
      }
    }
    if(!this.order) {
      console.log("Orden nueva");
      let varOrder: Order = {
        orderId: this.createOrderId(),
        completed: false,
        items: [],
        quantity: "0",
        date: String(new Date()),
        total: "0.0",
      }
      this.createItem(varOrder, id, colorId, sizeId, quantity, customer, true);
      this.addToCart = false;
    } else {
      console.log("Carrito existente");
      this.createItem(this.order, id, colorId, sizeId, quantity, customer, false);
      this.addToCart = false;
    }
  }

  retrievecartInfo(uid: string) {
    this.customerService.getCustomerByUid(uid).subscribe(data =>{
      console.log(data.payload.val());
      this.customerDetail = data.payload.val();
      if(!this.isEmpty(this.id) && !this.isEmpty(this.colorId) && !this.isEmpty(this.sizeId) && this.addToCart){
        console.log("Se tiene que crear orden");
        this.createOrder(this.id, this.color, this.size, this.quantity, data.payload.val() as Customer);
      } else if(this.refresh) {
        this.refresh = false;
        console.log("Se tiene que regresar la orden");
        this.retrieveOrder(this.customerDetail as Customer);
      }
    });
  }

  retrieveOrder(customer: Customer){
    console.log("Regresando orden");
    if(this.customerDetail?.orders) {
      console.log("Ordenes existentes");
      console.log(this.customerDetail.orders);
      this.customerDetail.orders.forEach(o =>{
        console.log(o);
        if(!o.completed){
          console.log("Orden no completada");
          this.order = o;
        }
      });
    }
    this.itemDetails = this.order?.items;
    this.setProductItems(this.itemDetails as Item[]);
  }

  setProductItems(items: Item[]){
    let newItems: Item[] = [];
    if(items) {
      items.forEach(itemAux => {
        this.productService.getProduct(itemAux.productId as string).subscribe((item: Product) =>{
          itemAux.productDetail = item;
          if(item.images) {
            itemAux.productDetail.mainImage = item.images[0].imagepath;
          }
          newItems.push(itemAux);
        });
      });
      this.itemDetails = newItems;
    }
  }


  createOrderId() {
  	let orderId= "OD00123";
  	return orderId;
  }

  isEmpty(str: string) {
  	return (!str || str.length === 0 );
  }

  createItem(order: Order, productId: string, colorId: string, sizeId: string, quantity: string, customer: Customer, isNew: boolean) {
    var existingItem = this.returnEqualItem(order, productId, colorId, sizeId);
    if(!existingItem.itemId) {
      let varItem = {
        itemId: this.generateItemId(),
        color: this.color,
        size: this.size,
        productId: productId,
        quantity: quantity
      }; 
      if(isNew) {
        console.log("Es un item nuevo");
        order.items = [];
        order.items.push(varItem);
        let arrOrder: Order[] = [];
        arrOrder.push(order);
        if(customer) {
          customer.orders = arrOrder;
          this.customerService.createOrUpdateCustomer(this.userInfo.uid, customer as Customer).then(() =>{
            this.refreshOrderDetails();
          });
        }
      } else {
        if(customer != undefined) {
          if(customer.orders != undefined) {
            var index = customer.orders.indexOf(order) as number;
            order.items = [];
            order.items.push(varItem);
            customer.orders[index] = order;
            this.customerService.createOrUpdateCustomer(this.userInfo.uid, customer).then(()=>{
              this.refreshOrderDetails();
            });
          }
        }
      }
    } else {
      let newQuantity = Number(quantity) + Number(existingItem.quantity);
      if(customer != undefined) {
        if(customer.orders != undefined) {
          var index = customer.orders.indexOf(order) as number;
          var itemsaux = customer.orders[index].items;
          if(itemsaux != undefined) {
            var indexItem= itemsaux.indexOf(existingItem) as number;
            existingItem.quantity = ""+ newQuantity;
            customer.orders[index].items = itemsaux;
            this.customerService.createOrUpdateCustomer(this.userInfo.uid, customer).then(()=>{
              this.refreshOrderDetails();
            });
          }
        }
      }
    }
  }

  returnEqualItem(order: Order, productId: string, colorId: string, sizeId: string): Item {
    let equalItem: Item = {};
    if(order.items?.length as number > 0 ) {
      order.items?.forEach(item =>{
        if(item.productId === productId && item.color === colorId && item.size === sizeId) {
          console.log("Iguales");
          equalItem = item;
        }
      });
    }
    return equalItem;
  }

  generateItemId() {
  	let itemId = "IT0010382";
  	return itemId;
  }

  refreshOrderDetails() {
  	this.customerService.getCustomerByUid(this.userInfo.uid).subscribe(data =>{
      this.customerDetail = data.payload.val();
      this.retrieveOrder(this.customerDetail as Customer);
    });
  }

  setCharAt(str: string,index: number,chr: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }
}
