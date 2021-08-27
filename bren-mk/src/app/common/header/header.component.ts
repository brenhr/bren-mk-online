import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	categories: any;
	showLogoutOption: boolean;
	showMyProfileOption: boolean;
	showLoginOption: boolean;

	constructor(public authService: AuthService, private categoryService: CategoryService) {
		this.showLoginOption = false;
		this.showLogoutOption = false;
		this.showMyProfileOption = false;
	}

	ngOnInit(): void {
		this.showMyProfileOption = this.authService.isLoggedIn && !this.authService.isAnonymous;
		this.showLoginOption = !this.authService.isLoggedIn;
		this.showLogoutOption = this.authService.isLoggedIn || this.authService.isAnonymous;
		
		this.categoryService.getCategories().subscribe(response => {
			this.categories = response;
		})
	}

}
