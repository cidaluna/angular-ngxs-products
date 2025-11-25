import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from './product.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // URL base do json-server
  // métodos retornam Observable que serão consumidos no state
  private api = 'http://localhost:3000/products';

  constructor(private readonly http: HttpClient) {}

  // buscar todos os produtos
  getAll(): Observable<IProduct[]> {
    //return this.http.get<IProduct[]>(this.api);
    console.log('[ProductService] Chamando getAll() em:', this.api);
    return this.http.get<IProduct[]>(this.api)
      .pipe(
        tap((data) => {
          console.log('[ProductService] getAll() retornou:', data);
        })
      );
  }

  // adicionar
  add(product: Partial<IProduct>): Observable<IProduct> {
    //return this.http.post<IProduct>(this.api, product);
    console.log('[ProductService] Chamando add() com:', product);
    return this.http.post<IProduct>(this.api, product)
      .pipe(
        tap((data) => {
          console.log('[ProductService] add() retornou:', data);
        })
      );
  }

  // deletar
  delete(id: number): Observable<void> {
    //return this.http.delete<void>(`${this.api}/${id}`);
    console.log('[ProductService] Chamando delete() com ID:', id);
    return this.http.delete<void>(`${this.api}/${id}`)
      .pipe(
        tap(() => {
          console.log('[ProductService] delete() completado para ID:', id);
        })
      );
  }
}
