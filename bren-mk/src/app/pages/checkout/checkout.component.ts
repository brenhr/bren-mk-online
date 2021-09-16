import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { ExampleService } from '../../services/example.service';

@Component({ 
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
	public result: any;
	public key = "";

  constructor(public authService: AuthService,
  			  public exampleService: ExampleService) {

  }

  ngOnInit(): void {
  	this.result = {id: "", name: ""};
  }

  fillForm(id: string, name: string) {
  	let body ={id: id, name: name};
  	this.postAndGetElement(body);
  }

  postElement(body: object) {
  	return new Promise<string> ((resolve, reject) =>{
  		this.exampleService.postExample(body).toPromise().then(res =>{
  			let json = JSON.parse(JSON.stringify(res));
  			this.key = json.name;
  			resolve(json.name);
  		});
  	});
  }

  getElement(name: string) {
  	this.exampleService.getExample(name).toPromise().then(body =>{
  		this.result = body;
  	});
  }

  postAndGetElement(body: object) {
  	this.postElement(body).then(name =>{
  		this.getElement(name);
  	})
  }
}
