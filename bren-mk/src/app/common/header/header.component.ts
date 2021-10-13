import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from "../../services/auth.service";
import { CategoryService } from '../../services/category.service';
import { Category } from '../../utils/models/category';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	categories?: Category[];
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
		
		this.categoryService.getCategories().snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => 
	          ({key: c.payload.doc.id, ... c.payload.doc.data()})
	        )
	      )
	    ).subscribe(data => {
	      this.categories = data;
	    });
	}

}
