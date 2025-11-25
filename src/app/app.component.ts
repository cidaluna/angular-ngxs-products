import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ProductState } from './state/product.state';
import { Observable } from 'rxjs';
import { AddProduct, DeleteProduct, LoadProducts } from './state/product.actions';
import { ProductsParentComponent } from "./products-parent/products-parent.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsParentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-ngxs-products';
}
