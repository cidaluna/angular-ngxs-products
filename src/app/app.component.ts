import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { ProductState } from './state/product.state';
import { Observable } from 'rxjs';
import { AddProduct, DeleteProduct, LoadProducts } from './state/product.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-ngxs-products';
  // propriedade usada pelo input
  newName = '';

  // usamos @Select para conectar Selectors do State
  @Select(ProductState.products) products$!: Observable<any[]>;
  @Select(ProductState.loading) loading$!: Observable<boolean>;
  @Select(ProductState.error) error$!: Observable<string | null>;

  constructor(private store: Store) {
    // Ao criar o componente, disparamos a ação para carregar os produtos
    this.store.dispatch(new LoadProducts());
  }

  add() {
    if (!this.newName?.trim()) return; // proteção simples

    this.store.dispatch(new AddProduct({ name: this.newName.trim() }));
    this.newName = '';
  }

  delete(id: number | undefined) {
    if (!id) return;
    this.store.dispatch(new DeleteProduct({ id }));
  }
}
