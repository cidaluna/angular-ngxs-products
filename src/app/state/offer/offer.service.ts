import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../../models/product.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Offer } from '../../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {
  // URL base do json-server
  // métodos retornam Observable que serão consumidos no state
  private api = 'http://localhost:3000/offers';

  constructor(private readonly http: HttpClient) {}

  // buscar todas as ofertas
  getOffers(): Observable<Offer[]> {
    console.log('[OfferService] Chamando getOffers() em:', this.api);
    return this.http.get<Offer[]>(this.api);
  }

  // criar oferta
  createOffer(dto: Omit<Offer, 'id' | 'createdAt'>): Observable<Offer> {
    console.log('[OfferService] Chamando createOffer() com:', dto);
    return this.http.post<Offer>(this.api, dto);
  }

  // excluir oferta
  deleteOffer(id: number): Observable<void> {
    console.log('[OfferService] Chamando deleteOffer() com ID:', id);
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
