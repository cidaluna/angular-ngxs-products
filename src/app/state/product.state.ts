import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ProductStateModel, Product } from './product.model';
import { LoadProducts, AddProduct, DeleteProduct, SetError } from './product.actions';
import { ProductService } from './product.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Cada @Action pode retornar um Observable — NGXS espera isso e lida com o fluxo.
// Usamos ctx.patchState() para atualizar apenas campos necessários (imutabilidade conserva o resto).
// Sempre tratamos erros com catchError para evitar streams quebradas.

// Estado inicial
const defaults: ProductStateModel = {
  products: [],
  loading: false,
  error: null
};


@State<ProductStateModel>({
  name: 'product',
  defaults
})
@Injectable()
export class ProductState {


  // SELECTOR — obter a lista de produtos
  @Selector()
    static products(state: ProductStateModel) {
    return state.products;
  }


  // SELECTOR — obter flag de loading
  @Selector()
    static loading(state: ProductStateModel) {
    return state.loading;
  }


  // SELECTOR — obter mensagem de erro
  @Selector()
    static error(state: ProductStateModel) {
    return state.error;
  }


  constructor(private productService: ProductService) {}


  // ACTION — carrega produtos do servidor
  @Action(LoadProducts)
    loadProducts(ctx: StateContext<ProductStateModel>) {
    // 1) setar loading true para a UI
    ctx.patchState({ loading: true, error: null });


    // 2) chamar o serviço que retorna Observable<Product[]>
    return this.productService.getAll()
      .pipe(
      tap((products: Product[]) => {
      // 3) quando chegar os dados, atualizamos o estado
      ctx.patchState({ products, loading: false });
      }),
      catchError((err) => {
      // 4) em caso de erro, atualizamos o estado com a mensagem
      const message = err?.message || 'Erro ao carregar produtos';
      ctx.patchState({ error: message, loading: false });
      // retornamos um observable que completa para NGXS
      return of([]);
      })
    );
  }


  // ACTION — adicionar produto no servidor e atualizar estado local
  @Action(AddProduct)
  addProduct(ctx: StateContext<ProductStateModel>, action: AddProduct) {
  ctx.patchState({ loading: true, error: null });
  const payload = action.payload;


  return this.productService.add({ name: payload.name })
  .pipe(
  tap((created: Product) => {
  // lemos o estado atual e adicionamos o produto criado
  const state = ctx.getState();
  ctx.patchState({ products: [...state.products, created], loading: false });
  }),
  catchError((err) => {
  const message = err?.message || 'Erro ao adicionar produto';
  ctx.patchState({ error: message, loading: false });
  return of(null);
  })
  );
  }


  // ACTION — deletar produto do servidor e atualizar estado
  @Action(DeleteProduct)
  deleteProduct(ctx: StateContext<ProductStateModel>, action: DeleteProduct) {
  ctx.patchState({ loading: true, error: null });
  const id = action.payload.id;


  return this.productService.delete(id)
  .pipe(
  tap(() => {
  const state = ctx.getState();
  ctx.patchState({ products: state.products.filter(p => p.id !== id), loading: false });
  }),
  catchError((err) => {
  const message = err?.message || 'Erro ao deletar produto';
  ctx.patchState({ error: message, loading: false });
  return of(null);
  })
  );
  }


  // ACTION simples para setar erros (pode ser usado pela UI)
  @Action(SetError)
    setError(ctx: StateContext<ProductStateModel>, action: SetError) {
    ctx.patchState({ error: action.payload.error });
  }
}
