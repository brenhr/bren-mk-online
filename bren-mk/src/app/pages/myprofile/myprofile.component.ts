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
  totalReviews: any;
  scoreReviews: any;
  isAdmin: boolean = false;
  orders: any[];
  items: any[];
  reviewsPerUser: any[];
  allReviews: any;
  arrayReviews: any[];

  constructor(public authService: AuthService, 
              private storage: AngularFireStorage,
              private customerService: CustomerService,
              private reviewService:ReviewService,
              private orderService: OrderService) {
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
    this.reviewsPerUser = [];
    this.arrayReviews = [];
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
      console.log(resp.length);
      resp = this.setCharAt(resp.substring(4,resp.length), 0, "[");
      resp = this.setCharAt(resp, resp.length-1, "]");
      console.log(resp);
      let respJson = JSON.parse(resp);
      this.customerDetail = respJson[0];
      this.isAdmin = this.customerDetail.role === "admin"? true: false;
      this.orders = this.customerDetail.orders;
      this.totalOrders = this.orders.length;
      this.totalReviews = this.getTotalReviews;
    });

    this.reviewService.getRewiews().subscribe(response =>{
      this.allReviews = response;
      this.arrayReviews = JSON.parse(JSON.stringify(response));
    });

    this.scoreReviews = this.getScoreAllReviews;
  }

  get userEmail(): string {
    const user = JSON.parse(localStorage.getItem('user')  || '{}');
    return(user !== null && user.email !== undefined) ? user.email: "";
  }

  get getTotalReviews(): number {
    for(let i =0; i< this.totalOrders; i++) {
      this.orderService.getOrder(this.orders[i].id).subscribe(response =>{
        let resp = JSON.parse(JSON.stringify(response));
        console.log(resp.items);
        console.log(resp.items.length);
        for(let j=0; j< resp.items.length; j++) {
          console.log(resp.items[j]);
          this.items.push(resp.items[j]);
        } 
      });
    }
    for(let i = 0; i< this.items.length; i++) {
      if(this.items[i].review!= undefined ){ 
        this.reviewsPerUser.push(this.items[i].review);

      }
    }
    return this.reviewsPerUser.length;
  }

  get getScoreAllReviews(): number {
    let sumReviews = 0;
    for(let i=0; i<this.arrayReviews.length; i++) {
      sumReviews = sumReviews + this.arrayReviews[i].score;
    }
    return sumReviews/this.arrayReviews.length;
  }

  setCharAt(str: string,index: number,chr: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }

}
