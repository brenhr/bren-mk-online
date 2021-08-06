import { Component, OnInit, Injectable, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import auth from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from "../../services/auth.service";
import { User } from "../../utils/models/user";

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


	constructor(public afs: AngularFirestore,
		public authService: AuthService,
		public afAuth: AngularFireAuth,
		public router: Router, 
		public ngZone: NgZone ) {

		this.afAuth.authState.subscribe(user => {
			if (user) {
				this.userData = user;
				localStorage.setItem('user', JSON.stringify(this.userData));
				JSON.parse(localStorage.getItem('user')  || '{}');
			} else {
				localStorage.setItem('user', '{}');
				JSON.parse(localStorage.getItem('user')  || '{}');
			}
		})
	}

	ngOnInit(): void {
	}

	registerUser(firstName: string, lastName: string, username: string, email: string, password: string, confirmPassword: string) {
		if(password === confirmPassword) {
			this.signUp(email, password);
		} else {
			this.showAlertPasswordMatch = true;
		}
	}

	signUp(email: string, password: string) {
		return this.afAuth.createUserWithEmailAndPassword(email, password)
		.then((result: any) => {
			this.sendVerificationMail();
			this.setUserData(result.user);
		}).catch((error: any) => {
			console.log(error.message);
			this.showAlertSignUpFail = true;
		})
	}

	sendVerificationMail() {
		return this.afAuth.currentUser.then(u => {
			if(u) {
				u.sendEmailVerification()
			}
		}).then(() => {
			this.router.navigate(['verify-email-address']);
		})
	}

	forgotPassword(passwordResetEmail: string) {
		return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
		.then(() => {
			this.showAlertResetPasswordSuccess = true;
		}).catch((error: any) => {
			console.log(error.message);
			this.showAlertResetPasswordFail = true;
		})
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

}