import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Fileupload } from '../utils/models/fileupload';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { Customer } from '../utils/models/customer';
import { Product } from '../utils/models/product';
import { Image } from '../utils/models/image';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
	private basePathProfilePhotos = '/profile-pictures';
	private basePathProducts = '/products';

	constructor(private storage: AngularFireStorage,
				private customerService: CustomerService,
				private productService: ProductService) { }

	pushFileToStorage(fileUpload: Fileupload, idCustomer: string, customer: Customer): Observable<number | undefined> {
		
		let filePath = `${this.basePathProfilePhotos}/${idCustomer}/${fileUpload.file.name}`;
		const storageRef = this.storage.ref(filePath);
		const uploadTask = this.storage.upload(filePath, fileUpload.file);
		uploadTask.snapshotChanges().pipe(
			finalize(() => {
				storageRef.getDownloadURL().subscribe(downloadURL => {
					customer.profilepicture = downloadURL;
					this.uploadPictureToDatabase(downloadURL, idCustomer, customer);				
				});
			})
		).subscribe();
		return uploadTask.percentageChanges();
	}

	deleteFile(fileUpload: Fileupload, type: string): void {
		this.deleteFileStorage(fileUpload.name, type);
	}

	private deleteFileStorage(name: string, type: string): void {
		if(type === "product") {
			const storageRef = this.storage.ref(this.basePathProducts);
			storageRef.child(name).delete();
		} else {
			const storageRef = this.storage.ref(this.basePathProfilePhotos);
			storageRef.child(name).delete();
		}
	}

	uploadPictureToDatabase(url: string, idCustomer: string, customer: Customer) {
		this.customerService.createOrUpdateCustomer(idCustomer, customer).then((response: any) =>{
			console.log(response);
		}).catch((error: any) =>{
			console.log("Error: " + error);
		});
	}

	uploadProductImagesToDatabase(body: Image[], idProduct: string, idToken: string, product: Product) {
		product.images = body;
		this.productService.update(idProduct, product).then((response: any) =>{
			console.log(response);
		}).catch((error: any) =>{
			console.log("Error: " + error);
		});
	}

	pushFilesToStorage(fileUpload1: Fileupload, fileUpload2: Fileupload, fileUpload3: Fileupload,
						 idProduct: string, model: string, idToken: string, product: Product): Observable<number | undefined> {
		let filePath1 = '';
		let filePath2 = '';
		let filePath3 = '';
		let arrayFiles: Image[] =[];
		filePath1 = `${this.basePathProducts}/${model}/${fileUpload1.file.name}`;
		filePath2 = `${this.basePathProducts}/${model}/${fileUpload2.file.name}`;
		filePath3 = `${this.basePathProducts}/${model}/${fileUpload3.file.name}`;

		const storageRef1 = this.storage.ref(filePath1);
		const uploadTask1 = this.storage.upload(filePath1, fileUpload1.file);
		const storageRef2 = this.storage.ref(filePath2);
		const uploadTask2 = this.storage.upload(filePath2, fileUpload2.file);
		const storageRef3 = this.storage.ref(filePath3);
		const uploadTask3 = this.storage.upload(filePath3, fileUpload3.file);
		uploadTask1.snapshotChanges().pipe(
			finalize(() => {
				storageRef1.getDownloadURL().subscribe(downloadURL => {
					let image1: Image = {type: "main", imagepath: downloadURL};
					arrayFiles.push(image1);
					uploadTask2.snapshotChanges().pipe(
						finalize(() => {
							storageRef2.getDownloadURL().subscribe(downloadURL => {
								let image2: Image = {type: "cloth", imagepath: downloadURL};
								arrayFiles.push(image2);
								uploadTask3.snapshotChanges().pipe(
									finalize(() => {
										storageRef3.getDownloadURL().subscribe(downloadURL => {
											let image3: Image = {type: "model", imagepath: downloadURL};
											arrayFiles.push(image3);
											let body = {images: arrayFiles};
											this.uploadProductImagesToDatabase(arrayFiles, idProduct, idToken, product);
										});
									})
								).subscribe();		
							});
						})
					).subscribe();		
				});
			})
		).subscribe();
		return uploadTask1.percentageChanges();
	}
}
