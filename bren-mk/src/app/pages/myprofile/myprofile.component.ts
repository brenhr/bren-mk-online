import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { Fileupload } from '../../utils/models/fileupload';
import { StorageService } from '../../services/storage.service';
import { Customer } from '../../utils/models/customer';
import { Detail } from '../../utils/models/detail';
import { Product } from '../../utils/models/product';
import { Order } from '../../utils/models/order';
import { Item } from '../../utils/models/item';
import { Color } from '../../utils/models/color';
import { Size } from '../../utils/models/size';
import { Status } from '../../utils/models/status';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  public imagePath: any;
  showAlertErrorAddProduct?: boolean;
  showAlertSuccessAddProduct?: boolean;
  imgURL: any;
  imgURL2: any;
  imgURL3: any;
  img1: any;
  img2: any;
  img3: any;
  imgProfile: any;
  public message?: string;
  showMainImage?: boolean;
  showImage2?: boolean;
  showImage3?: boolean;
  customerDetail?: Customer;
  totalOrders: any;
  detailTotalOrders?: any[];
  totalReviews: any;
  scoreReviews: any;
  isAdmin: boolean = false;
  orders?: any[];
  reviewsPerUser?: any[];
  allReviews: any;
  arrayReviews?: any[];
  itemsDetail?: Item[];
  detailReviews?: any[];
  detailProducts?: Product[];
  selectedFiles?: FileList;
  currentFileUpload?: Fileupload;
  infoAuth: any;
  showAlertErrorUploadingImage?: boolean;
  showAlertSuccessUploadingImage?: boolean;
  arrayColors: any;
  arraySizes: any;
  arrayCategories: any;
  arrayBrands: any;
  arrayVersions?: Detail[];
  arrayCustomer?: Customer[];


  constructor(public authService: AuthService, 
              private storage: AngularFireStorage,
              private customerService: CustomerService,
              private reviewService:ReviewService,
              private orderService: OrderService,
              private itemService: ItemService,
              private productService: ProductService,
              private addressService: AddressService,
              private colorService: ColorService,
              private sizeService: SizeService,
              private storageService: StorageService,
              private brandService: BrandService,
              private categoryService: CategoryService) {

    let info = JSON.parse(localStorage.getItem('user')  || '{}');
    this.infoAuth = info.uid;
    
  }

  ngOnInit(): void {
    this.arrayVersions = [];
    this.populatePage();
    this.itemsDetail = [];
    this.detailReviews = [];
  }

  populatePage() {
    this.getUserInformation();
  }

  getProductCatalog() {
    this.productService.getProducts().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => 
          ({key: c.payload.doc.id, ... c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.detailProducts = data;
      this.populateColorsAndSizes(data as Product[]);
    });
  }

  populateColorsAndSizes(products: Product[]) {
    if(products) {
      products.forEach(varProduct =>{
        let auxColors: Color[] = [];
        let auxSizes: Size[] = [];
        if(varProduct.details) {
          varProduct.details.forEach(varDetails => {
            let idColor = varDetails.color;
            this.colorService.getColor(idColor as string).subscribe((item: Color) => {
              let color: Color = item;
              color.key = idColor;
              if(!this.colorExistsInArray(auxColors, color)) {
                auxColors.push(color);
              }
            }, (error: any) => {
              console.log("Error: " + error);
            });
            let idSize = varDetails.size;
            this.sizeService.getSize(idSize as string).subscribe((item: Size) => {
              let size: Size = item;
              size.key = idSize;
              if(!this.sizeExistsInArray(auxSizes, size)) {
                auxSizes.push(size);
              }
            }, (error: any) => {
              console.log("Error: " + error);
            });
          });
          varProduct.colors = auxColors;
          varProduct.sizes = auxSizes;
        }
      });
      this.detailProducts = products;
    }
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

  getCatalogs() {
    this.getSizeCatalog();
    this.getColorCatalog();
    this.getBrandCatalog();
    this.getCategorycatalog();

  }

  getUserInformation() {
    const uid = this.userUid;
    this.customerService.getCustomerByUid(uid).subscribe(data =>{
      this.customerDetail = data.payload.val();
      this.populateCustomerdetails(this.customerDetail as Customer);
    });
  }


  populateCustomerdetails(customer: Customer) {
    this.imgProfile = customer.profilepicture;
    this.isAdmin = customer.role === "admin"? true: false;
    this.orders = customer.orders;
    if(customer.orders) {
      this.totalOrders = customer.orders.length;
      this.totalReviews = this.getTotalReviews(customer.orders as Order[]);
    } else {
      this.totalOrders = "0";
      this.totalReviews = "0";
    }
    if(this.isAdmin) {
      this.getProductCatalog();
      this.getCatalogs();
    }
  }

  populateOrderDetails(customer: Customer) {
    if(customer.orders != null){
      customer.orders.forEach(order => {
        if(order.items != null) {
          order.items.forEach(item => {
            this.productService.getProduct(item.productId as string).subscribe((product: Product) => {
              let productVar: Product = item;
              productVar.key = item.productId;
              item.address = order.address;
              item.orderId = order.orderId + '-' + item.itemId;
              if(order.status  != undefined && order.status.length >0) {
                item.lastStatus = order.status?.pop();
              } else {
                let status: Status = {status: "No status so far."};
                item.lastStatus = status;
              }
              item.productDetail = productVar;
              this.itemsDetail?.push(item);
            }, (error: any) => {
              console.log("Error: " + error);
            });
          });
        }
      });
    }
  }


  getSizeCatalog() {
    this.sizeService.getSizes().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => 
          ({key: c.payload.doc.id, ... c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.arraySizes = data;
    });
  }

  getColorCatalog() {
    this.colorService.getColors().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => 
          ({key: c.payload.doc.id, ... c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.arrayColors = data;
    });
  }

  getBrandCatalog() {
    this.brandService.getBrands().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => 
          ({key: c.payload.doc.id, ... c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.arrayBrands = data;
    });
  }

  getCategorycatalog() {
    this.categoryService.getCategories().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => 
          ({key: c.payload.doc.id, ... c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.arrayCategories = data;
    });
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
        this.img1 = files;
      } else if(id ==='2') {
        this.imgURL2 = reader.result; 
        this.showImage2 = true;
        this.img2 = files;
      } else if(id === '3'){
        this.img3 = files;
        this.imgURL3 = reader.result; 
        this.showImage3 = true;
      } else {
        this.imgProfile = reader.result;
      }
    }
  }

  get userUid(): string {
    const user = JSON.parse(localStorage.getItem('user')  || '{}');
    return(user !== null && user.uid !== undefined) ? user.uid: "";
  }

  getTotalReviews(orders: Order[]) {
    let countReviews =0;
    orders.forEach(order =>{
      order.items?.forEach(item =>{
        if(item.review != null){
          countReviews +=1;
        }
      });
    });
    return countReviews;
  }

  upload(): void {
    this.showAlertErrorUploadingImage = false;
    this.showAlertSuccessUploadingImage = false;
    if (this.imagePath) {
      const file: File | null = this.imagePath.item(0);
      this.selectedFiles = undefined;
      if (file) {
        this.currentFileUpload = new Fileupload(file);
        this.storageService.pushFileToStorage(this.currentFileUpload, this.infoAuth, this.customerDetail as Customer).subscribe(
          percentage => {
            if(percentage === 100) {
              this.showAlertSuccessUploadingImage = true;
            }
          },
          error => {
            this.showAlertErrorUploadingImage = true;
          }
        );
      }
    }
  }

  registerProduct(brand: string, category: string, model: string, name: string, description: string, price: string, keywords: string){
    let product: Product = {
      brandId: brand,
      categoryId: category,
      description: description,
      details: this.arrayVersions,
      images: [],
      keywords: keywords.split(','),
      model: model,
      name: name,
      price: price
    }

    this.productService.registerProduct(product).then((result: any) =>{
      console.log(result);
      this.uploadProductImages(result.id, model, product);
    }).catch((error: any) =>{
      this.showAlertErrorAddProduct = true;
    });
  }

  addVersion(idColor: string, idSize: string, stock: string){
    let version: Detail = {
      color: idColor,
      size: idSize,
      stock: stock,
      soldunits: "0"
    }
    this.arrayVersions?.push(version);
  }

  uploadProductImages(idProduct: string, model: string, product: Product){
    if (this.imgURL && this.imgURL2 && this.imgURL3) {
      const file1: File | null = this.img1.item(0);
      const file2: File | null = this.img2.item(0);
      const file3: File | null = this.img3.item(0);
      this.selectedFiles = undefined;
      if (file1 && file2 && file3) {
        let currentFileUpload1 = new Fileupload(file1);
        let currentFileUpload2 = new Fileupload(file2);
        let currentFileUpload3 = new Fileupload(file3);
        this.storageService.pushFilesToStorage(currentFileUpload1, currentFileUpload2, currentFileUpload3, idProduct, model, this.infoAuth, product).subscribe(
          percentage => {
            if(percentage === 100) {
              this.showAlertSuccessAddProduct = true;
            }
          },
          error => {
            this.showAlertErrorAddProduct = true;
          }
        );
      }
    }
  }
}
