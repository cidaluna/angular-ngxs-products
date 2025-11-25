// Actions representam intenções (o "quê" deve acontecer), representa coisas que o usuário ou sistema deseja fazer.
// Cada action é uma classe com um tipo estático e, opcionalmente, um payload.
// type é uma string única que identifica a ação.
// A ação string pode ser chamada em reducers, effects ou stores para reagir a essa ação.
// Payload é um objeto que carrega dados adicionais necessários para a ação.

// LoadProducts: carregar a lista de produtos
export class LoadProducts {
  static readonly type = '[Product] Load Products';
}

// AddProduct: adicionar um novo produto
export class AddProduct {
static readonly type = '[Product] Add Product';
constructor(public payload: { name: string }) {}
}

// DeleteProduct: remover um produto existente
export class DeleteProduct {
static readonly type = '[Product] Delete Product';
constructor(public payload: { id: number }) {}
}

// SetError: definir uma mensagem de erro
export class SetError {
static readonly type = '[Product] Set Error';
constructor(public payload: { error: string | null }) {}
}
