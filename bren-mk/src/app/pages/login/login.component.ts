import { Component, OnInit, Injectable, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import auth from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from "../../services/auth.service";
import { User } from "../../utils/models/user";
import { environment } from '../../../environments/environment';
import { CustomerService } from '../../services/customer.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Customer } from '../../utils/models/customer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	userData: any; 
	showAlertPasswordMatch: boolean = false;
	showAlertEmail: boolean = false;
	showAlertSingUpSuccess: boolean = false;
	showAlertResetPasswordSuccess: boolean = false;
	showAlertSignUpFail: boolean = false;
	showAlertVerifyEmailFail: boolean = false;
	showAlertResetPasswordFail: boolean = false;
	showAlertSignInFail: boolean = false;
	defaultProfilePicture: string = environment.assets.defaultProfilePicture;


	constructor(public afs: AngularFirestore,
		public authService: AuthService,
		public afAuth: AngularFireAuth,
		public router: Router, 
		public ngZone: NgZone,
		public customerService: CustomerService,
		private analytics: AngularFireAnalytics) {

		this.afAuth.authState.subscribe(user => {
			if (user) {
				this.userData = user;
				localStorage.setItem('user', JSON.stringify(this.userData));
				JSON.parse(localStorage.getItem('user')  || '{}');
				if(this.authService.isLoggedIn){
					this.router.navigate(['my-profile']);
				}
			} else {
				localStorage.setItem('user', '{}');
				let info = JSON.parse(localStorage.getItem('user')  || '{}');
				let idToken = info.stsTokenManager.accessToken;
				console.log(idToken);
			}
		})
	}

	ngOnInit(): void {
	}

	registerUser(firstName: string, lastName: string, username: string, email: string, password: string, confirmPassword: string) {
		if(password === confirmPassword) {
			this.signUp(email, password, firstName, lastName, username);
			let infoAnalytics ={email: email};
			this.analytics.logEvent('register_action', infoAnalytics);
		} else {
			this.showAlertPasswordMatch = true;
		}
	}

	signUp(email: string, password: string, firstName: string, lastName: string, username: string) {
		return this.afAuth.createUserWithEmailAndPassword(email, password)
		.then((result: any) => {
			this.sendVerificationMail(result.user, email, firstName, lastName, username);
		}).catch((error: any) => {
			console.log(error.message);
			this.showAlertSignUpFail = true;
		})
	}

	sendVerificationMail(user: any, email: string, firstName: string, lastName: string, username: string) {

		return this.afAuth.currentUser.then(u => {
			if(u) {
				u.sendEmailVerification()
			}
		}).then(() => {
			this.setUserData(user);
			this.registerUserInDatabase(user, email, firstName, lastName, username);
		}).catch((error: any) => {
			this.showAlertVerifyEmailFail = true;
		});

	}

	forgotPassword(passwordResetEmail: string) {
		let infoAnalytics ={email: passwordResetEmail};
		this.analytics.logEvent('reset_password_action', infoAnalytics);
		return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
		.then(() => {
			this.showAlertResetPasswordSuccess = true;
		}).catch((error: any) => {
			console.log(error.message);
			this.showAlertResetPasswordFail = true;
		})
	}

	signIn(email: string, password: string) {
		console.log("Login...");
		return this.afAuth.signInWithEmailAndPassword(email, password)
		.then((result: any) => {
			let infoAnalytics ={email: email};
			this.analytics.logEvent('login_action', infoAnalytics);
			this.ngZone.run(() => {
				this.setUserData(result.user);
				this.router.navigate(['my-profile']);
			});
		}).catch((error: any) => {
			window.alert(error.message);
			console.log(error.message);
			this.showAlertSignInFail = true;
		});
	}

	 setUserData(user: any) {
	 	const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
	 	const userData: User = {
	 		uid: user.uid,
	 		email: user.email,
	 		displayName: user.displayName,
	 		photoURL: user.photoURL,
	 		emailVerified: user.emailVerified
	 	}
	 	return userRef.set(userData, {
	 		merge: true
	 	})
	}

	registerUserInDatabase(userData: any, email: string, firstName: string, lastName: string, username: string) {
		const user: Customer = {
			email: email, 
			firstname: firstName, 
			lastname: lastName, 
			username: username, 
			role: "customer", 
			address: [],
			orders: [],
			profilepicture: this.defaultProfilePicture
		};

		this.customerService.createOrUpdateCustomer(userData.uid, user).then((result: any) =>{
			this.showAlertSingUpSuccess = true;
		}).catch((error: any) => {
			window.alert(error.message);
			this.showAlertSignInFail = true;
		});
	}

}