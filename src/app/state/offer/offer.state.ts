import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Offer } from '../../models/offer.model';
import { OfferService } from './offer.service';
import { LoadOffers, CreateOffer, CreateOfferSuccess, CreateOfferFail } from './offer.actions';

// Cada @Action pode retornar um Observable — NGXS espera isso e lida com o fluxo.
// Usamos ctx.patchState() para atualizar apenas campos necessários (imutabilidade conserva o resto).
// Sempre tratamos erros com catchError para evitar streams quebradas.

// Estado inicial
export interface OfferStateModel {
  offers: Offer[];
  loading: boolean;
  error: string | null;
};


@State<OfferStateModel>({
  name: 'offers',
  defaults: {
    offers: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class OfferState {
  constructor(private readonly offerService: OfferService) {}

  @Selector()
  static offers(state: OfferStateModel) {
    console.log('[OfferState] Selector offers chamado:', state.offers);
    return state.offers;
  }

  @Selector()
  static loading(state: OfferStateModel) {
    console.log('[OfferState] Selector loading chamado:', state.loading);
    return state.loading;
  }

  @Selector()
  static error(state: OfferStateModel) {
    console.log('[OfferState] Selector error chamado:', state.error);
    return state.error;
  }

  @Action(LoadOffers)
  loadOffers(ctx: StateContext<OfferStateModel>) {
    console.log('[OfferState] Action LoadOffers iniciada');
    ctx.patchState({ loading: true, error: null });
    return this.offerService.getOffers().pipe(
      tap((offers) => {
        console.log('[OfferState] LoadOffers sucesso:', offers);
        ctx.patchState({ offers, loading: false });
      }),
      catchError((error) => {
        console.error('[OfferState] LoadOffers falhou:', error);
        ctx.patchState({ loading: false, error: error.message || 'Erro ao carregar ofertas' });
        return of(error);
      })
    );
  }

  @Action(CreateOffer)
  createOffer(ctx: StateContext<OfferStateModel>, action: CreateOffer) {
    console.log('[OfferState] Action CreateOffer iniciada com payload:', action.payload);
    ctx.patchState({ loading: true, error: null });

    // chamar o serviço para criar a oferta
    return this.offerService.createOffer(action.payload).pipe(
      tap((created: Offer) => {
        console.log('[OfferState] CreateOffer sucesso:', created);
        ctx.setState((state) => {
          return {
            ...state,
            offers: [...state.offers, created],
            loading: false
          };
        });
        ctx.dispatch(new CreateOfferSuccess(created));
      }
      ),
      catchError((error) => {
        console.error('[OfferState] CreateOffer falhou:', error);
        ctx.patchState({ loading: false, error: error.message || 'Erro ao criar oferta' });
        ctx.dispatch(new CreateOfferFail(error));
        return of(error);
      })
    );
  }
}
