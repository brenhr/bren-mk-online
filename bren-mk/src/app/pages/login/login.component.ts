import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	constructor(private afAuth: AngularFireAuth, private router: Router, 
  				private fb: FormBuilder, private ngZone: NgZone) {

	}

	loginForm = this.fb.group({
		email: ['', Validators.required],
		password: ['', Validators.required]
	})

ngOnInit() {
	this.afAuth.user.subscribe(user => {
		if (user) {
		this.ngZone.run(() => {
			this.router.navigate(['/myprofile']);
    	})
	})

	signIn() {
		this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(() => {
			this.router.navigate(['/myprofile']);
		}).catch(response => {
			this.errorMessage = response.message;
	});
}
