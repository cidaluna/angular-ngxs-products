import { Offer } from '../../models/offer.model';
// Actions representam intenções (o "quê" deve acontecer), representa coisas que o usuário ou sistema deseja fazer.
// Cada action é uma classe com um tipo estático e, opcionalmente, um payload.
// type é uma string única que identifica a ação.
// A ação string pode ser chamada em reducers, effects ou stores para reagir a essa ação.
// Payload é um objeto que carrega dados adicionais necessários para a ação.

// Carrega a lista de ofertas
export class LoadOffers {
  static readonly type = '[Offers] Load Offers';
}

// Cria uma oferta
export class CreateOffer {
static readonly type = '[Offers] Create Offer';
constructor(public payload: Omit<Offer, 'id' | 'createdAt'>) {}
}

// Successo na criação de uma oferta
export class CreateOfferSuccess {
static readonly type = '[Offers] Create Offer Success';
constructor(public payload: Offer) {}
}

// Falha na criação de uma oferta
export class CreateOfferFail {
static readonly type = '[Offers] Create Offer Fail';
constructor(public error: any) {}
}
