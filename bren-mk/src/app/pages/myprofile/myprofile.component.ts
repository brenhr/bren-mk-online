import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { ColorService } from '../../services/color.service';
import { ProductService } from '../../services/product.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { CustomerService } from '../../services/customer.service';
import { ReviewService } from '../../services/review.service';
import { OrderService } from '../../services/order.service';
import { ItemService } from '../../services/item.service';
import { AddressService} from '../../services/address.service';
import { SizeService } from '../../services/size.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  public imagePath: any;
  showAlertErrorAddingProduct: boolean;
  imgURL: any;
  imgURL2: any;
  imgURL3: any;
  public message: string;
  showMainImage: boolean;
  showImage2: boolean;
  showImage3: boolean;
  customerDetail: any;
  totalOrders: any;
  detailTotalOrders: any[];
  totalReviews: any;
  scoreReviews: any;
  isAdmin: boolean = false;
  orders: any[];
  items: any[];
  reviewsPerUser: any[];
  allReviews: any;
  arrayReviews: any[];
  totalProducts: any;
  itemsDetail: any[];
  detailReviews: any[];
  detailProducts: any[];

  constructor(public authService: AuthService, 
              private storage: AngularFireStorage,
              private customerService: CustomerService,
              private reviewService:ReviewService,
              private orderService: OrderService,
              private itemService: ItemService,
              private productService: ProductService,
              private addressService: AddressService,
              private colorService: ColorService,
              private sizeService: SizeService) {
  	this.imagePath = null;
  	this.imgURL = null;
  	this.imgURL2 = null;
  	this.imgURL3 = null;
  	this.message = "";
  	this.showMainImage = false;
    this.showImage2 = false;
    this.showImage3 = false;
    this.showAlertErrorAddingProduct = false;
    this.orders = [];
    this.items = [];
    this.itemsDetail = [];
    this.reviewsPerUser = [];
    this.arrayReviews = [];
    this.detailTotalOrders = [];
    this.detailReviews = [];
    this.detailProducts = [];
  }

  preview(files: any, id: string) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      if(id ==='1') {
      	this.imgURL = reader.result; 
      	this.showMainImage = true;
      } else if(id ==='2') {
      	this.imgURL2 = reader.result; 
      	this.showImage2 = true;
      } else{
      	this.imgURL3 = reader.result; 
      	this.showImage3 = true;
      }
    }
  }

  ngOnInit(): void {

    let email = this.userEmail;

    this.customerService.getUserByEmail(email).subscribe(response =>{
      let resp = JSON.stringify(response);
      resp = this.setCharAt(resp.substring(4,resp.length), 0, "[");
      resp = this.setCharAt(resp, resp.length-1, "]");
      let respJson = JSON.parse(resp);
      this.customerDetail = respJson[0];
      this.isAdmin = this.customerDetail.role === "admin"? true: false;
      this.orders = this.customerDetail.orders;
      this.totalOrders = this.orders.length;
      this.totalReviews = this.getTotalReviews();
      if(this.isAdmin){
        this.orderService.getOrders().subscribe(response =>{
          let respJson = JSON.parse(JSON.stringify(response));
          this.detailTotalOrders = respJson;
          this.setDetailsTotalOrders();
          this.setDetailProducts();
        });
      } else {
        for(let i= 0; i< this.totalOrders.length; i++){
          this.orderService.getOrder(this.totalOrders[i]).subscribe(response =>{
            this.detailTotalOrders.push(response);
            this.setDetailsTotalOrders();
          });
        }
      }
    });

    this.reviewService.getRewiews().subscribe(response =>{
      this.allReviews = response;
      this.arrayReviews = JSON.parse(JSON.stringify(response));
      this.scoreReviews = this.getScoreAllReviews;
    });

    this.productService.getProducts().subscribe(response =>{
      this.totalProducts = response;
    });

    
  }

  get userEmail(): string {
    const user = JSON.parse(localStorage.getItem('user')  || '{}');
    return(user !== null && user.email !== undefined) ? user.email: "";
  }

  getTotalReviews() {
    for(let i =0; i< this.totalOrders; i++) {
      this.orderService.getOrder(this.orders[i].id).subscribe(response =>{
        let resp = JSON.parse(JSON.stringify(response));
        for(let j=0; j< resp.items.length; j++) {
          this.items.push(resp.items[j].id);
        } 

        for(let i = 0; i< this.items.length; i++) {
          this.itemService.getItem(this.items[i]).subscribe(response =>{
            let resp = JSON.parse(JSON.stringify(response));
            this.reviewsPerUser.push(resp);
            return this.reviewsPerUser.length;
          });
        }
      });
    }
    
  }

  setDetailsTotalOrders() {
    for(let i= 0; i < this.detailTotalOrders.length; i++){
      this.detailTotalOrders[i].addresDetail = {};
      this.detailTotalOrders[i].itemsDetail = [];
      this.addressService.getAddress(this.detailTotalOrders[i].address.id).subscribe(response =>{
        this.detailTotalOrders[i].addresDetail = response;
      });
      let itemsArray = this.detailTotalOrders[i].items;
      for(let j=0; j< itemsArray.length; j++) {
        this.itemService.getItem(itemsArray[j].id).subscribe(response =>{
          let resp = JSON.parse(JSON.stringify(response));
          let arrayItems: any[];
          arrayItems =[];
          arrayItems.push(resp);
          for(let k=0; k < arrayItems.length; k ++){
            arrayItems[k].productDetail = {};
            arrayItems[k].reviewDetail = {};
            this.productService.getProductDetail(arrayItems[k].product.id).subscribe(response =>{
              arrayItems[k].productDetail = response;
              if(arrayItems[k].review != {}) {
                this.reviewService.getReviewDetail(arrayItems[k].review.id).subscribe(response =>{
                  let resp = JSON.parse(JSON.stringify(response));
                  resp.orderId = this.detailTotalOrders[i].id + '-' + arrayItems[k].id; 
                  arrayItems[k].reviewDetail = resp;
                  resp.name = arrayItems[k].productDetail.name;
                  this.detailReviews.push(resp);
                });
              }
              arrayItems[k].orderId = this.detailTotalOrders[i].id + '-' + arrayItems[k].id; 
              arrayItems[k].addressDetail = this.detailTotalOrders[i].addresDetail;
              arrayItems[k].lastStatus = this.detailTotalOrders[i].status[this.detailTotalOrders[i].status.length-1];
              arrayItems[k].statusDetails = this.detailTotalOrders[i].status;
              this.itemsDetail.push(arrayItems[k]);
            });
          }
          this.detailTotalOrders[i].itemsDetail.push(arrayItems);
        });
      }
    }
  }

  setDetailProducts() {
    this.productService.getProducts().subscribe(response=>{
      let resp = JSON.parse(JSON.stringify(response));
      for(let i=0; i<resp.length; i++){
        resp[i].colors = [];
        resp[i].sizes =[];
        for(let j=0; j< resp[i].details.length; j++) {
          this.colorService.getColor(resp[i].details[j].color.id).subscribe(response =>{
            resp[i].details[j].colorDetail = response;
            if(!this.colorExistsInArray(resp[i].colors, response)){
              resp[i].colors.push(response);
            }
          });
          this.sizeService.getSize(resp[i].details[j].size.id).subscribe(response=> {
            resp[i].details[j].sizeDetail = response;
            if(!this.sizeExistsInArray(resp[i].sizes, response)){
              resp[i].sizes.push(response);
            }
          });
        }
        this.detailProducts.push(resp[i]);
      }
      console.log(this.detailProducts);
    });
  }

  get getScoreAllReviews(): number {
    let sumReviews = 0;
    for(let i=0; i<this.arrayReviews.length; i++) {
      sumReviews = sumReviews + this.arrayReviews[i].rate;
    }
    return sumReviews/this.arrayReviews.length;
  }

  setCharAt(str: string,index: number,chr: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
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

}
