import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // URL base do json-server
  // métodos retornam Observable que serão consumidos no state
  private api = 'http://localhost:3000/products';

  constructor(private readonly http: HttpClient) {}

  // buscar todos os produtos
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  // adicionar
  add(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.api, product);
  }

  // deletar
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
