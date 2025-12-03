import { Component } from '@angular/core';
import { ProductsParentComponent } from "./products-parent/products-parent.component";
import { FormOfferComponent } from "./form-offer/form-offer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsParentComponent, FormOfferComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-ngxs-products';
}
