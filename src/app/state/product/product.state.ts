import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IProductStateModel, IProduct } from '../../models/product.model';
import { LoadProducts, AddProduct, DeleteProduct, SetError } from './product.actions';
import { ProductService } from './product.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Cada @Action pode retornar um Observable — NGXS espera isso e lida com o fluxo.
// Usamos ctx.patchState() para atualizar apenas campos necessários (imutabilidade conserva o resto).
// Sempre tratamos erros com catchError para evitar streams quebradas.

// Estado inicial
const defaults: IProductStateModel = {
  products: [],
  loading: false,
  error: null
};


@State<IProductStateModel>({
  name: 'product',
  defaults
})
@Injectable()
export class ProductState {


  // SELECTOR — obter a lista de produtos
  @Selector()
  static products(state: IProductStateModel) {
    console.log('[ProductState] Selector products chamado:', state.products);
    return state.products;
  }


  // SELECTOR — obter flag de loading
  @Selector()
  static loading(state: IProductStateModel) {
    console.log('[ProductState] Selector loading chamado:', state.loading);
    return state.loading;
  }


  // SELECTOR — obter mensagem de erro
  @Selector()
  static error(state: IProductStateModel) {
    console.log('[ProductState] Selector error chamado:', state.error);
    return state.error;
  }


  constructor(private readonly productService: ProductService) {}


  // ACTION — carrega produtos do servidor
  @Action(LoadProducts)
  loadProducts(ctx: StateContext<IProductStateModel>) {
    console.log('[ProductState] Action LoadProducts iniciada');
    // 1) setar loading true para a UI
    ctx.patchState({ loading: true, error: null });


    // 2) chamar o serviço que retorna Observable<Product[]>
    return this.productService.getAll()
      .pipe(
        tap((products: IProduct[]) => {
          console.log('[ProductState] Produtos recebidos do serviço:', products);
          // 3) quando chegar os dados, atualizamos o estado
          //ctx.patchState({ products, loading: false });
          // sempre setar um NOVO array (não mutar o anterior)
          ctx.patchState({ products: Array.isArray(products) ? [...products] : [], loading: false });
          console.log('[ProductState] Estado atualizado com produtos');
        }),
        catchError((err) => {
          console.error('[ProductState] Erro ao carregar produtos:', err);
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
  addProduct(ctx: StateContext<IProductStateModel>, action: AddProduct) {
    console.log('[ProductState] Action AddProduct iniciada com payload:', action.payload);
    ctx.patchState({ loading: true, error: null });

    return this.productService.add({ name: action.payload.name })
      .pipe(
        tap((created: IProduct) => {
          // lemos o estado atual e adicionamos o produto criado
          const state = ctx.getState();
          ctx.patchState({ products: [...state.products, created], loading: false });
          console.log('[ProductState] Produto criado e adicionado:', created);
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
  deleteProduct(ctx: StateContext<IProductStateModel>, action: DeleteProduct) {
  console.log('[ProductState] Action DeleteProduct iniciada com ID:', action.payload.id);
    ctx.patchState({ loading: true, error: null });
    const id = action.payload.id;

    return this.productService.delete(id)
      .pipe(
        tap(() => {
          console.log('[ProductState] Produto deletado com ID:', id);
          const state = ctx.getState();
          ctx.patchState({ products: state.products.filter(p => p.id !== id), loading: false });
          console.log('[ProductState] Estado atualizado após deleção');
        }),
        catchError((err) => {
          console.error('[ProductState] Erro ao deletar produto:', err);
          const message = err?.message || 'Erro ao deletar produto';
          ctx.patchState({ error: message, loading: false });
          return of(null);
        })
      );
  }


  // ACTION simples para setar erros (pode ser usado pela UI)
  @Action(SetError)
  setError(ctx: StateContext<IProductStateModel>, action: SetError) {
    console.log('[ProductState] Action SetError iniciada com:', action.payload.error);
    ctx.patchState({ error: action.payload.error });
  }
}
