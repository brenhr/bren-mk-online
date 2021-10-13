import { Component, OnInit } from '@angular/core';
import {IdentityToolkitService } from '../../services/identity-toolkit.service'

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

	constructor(public ids: IdentityToolkitService) { }

	ngOnInit(): void {

	}

	signUp(email: string, password: string) {
		let body = {email: email, password: password, returnSecureToken: true};
		this.ids.registerUser(body).subscribe(response =>{
			let resp = JSON.parse(JSON.stringify(response));
			let body2 ={requestType: "VERIFY_EMAIL", idToken: resp.idToken};
			this.ids.sendVerificationEmail(body2).subscribe(response =>{
				console.log(response);
			})
		})
	}

}
