import { Component, OnInit } from '@angular/core';
import { ProductsChildComponent } from '../products-child/products-child.component';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { ProductState } from '../state/product.state';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IProduct } from '../state/product.model';
import { LoadProducts, AddProduct, DeleteProduct } from '../state/product.actions';

@Component({
  selector: 'app-products-parent',
  standalone: true,
  imports: [CommonModule, ProductsChildComponent],
  templateUrl: './products-parent.component.html',
  styleUrl: './products-parent.component.scss'
})
export class ProductsParentComponent implements OnInit {
  // Seletores do NGXS
  @Select(ProductState.products)
  products$!: Observable<IProduct[]>;

  @Select(ProductState.loading)
  loading$!: Observable<boolean>;

  @Select(ProductState.error)
  error$!: Observable<string | null>;

  // fallback local (snapshot) para garantir array definitivo na UI
  productsLocal: IProduct[] = [];

  constructor(private store: Store) {
    console.log('[ProductsParentComponent] Construtor chamado');
  }

  ngOnInit(): void {
    console.log('[ProductsParentComponent] ngOnInit chamado');
    console.log('[ProductsParentComponent] Disparando LoadProducts');
    // Ao iniciar o componente pai, carregamos os produtos do backend (json-server)
    this.store.dispatch(new LoadProducts());

    // Assinatura segura diretamente via store.select para popular productsLocal
    this.store.select(ProductState.products)
      .pipe(
        tap((p) => console.log('[ProductsParentComponent] store.select(products) emitiu:', p))
      )
      .subscribe((p) => {
        // garante sempre um array (não null/undefined)
        this.productsLocal = Array.isArray(p) ? [...p] : [];
        console.log('[ProductsParentComponent] productsLocal atualizado:', this.productsLocal);
      });
  }

  // Método chamado pelo componente filho
  onAddProduct(name: string) {
    console.log('[ProductsParentComponent] onAddProduct chamado com:', name);
    if (!name.trim()) return;

    const newProduct = { name };
    this.store.dispatch(new AddProduct(newProduct));
  }

  // Método chamado pelo filho
  onDeleteProduct(id: number) {
    console.log('[ProductsParentComponent] onDeleteProduct chamado com ID:', id);
    this.store.dispatch(new DeleteProduct({id}));
  }
}
