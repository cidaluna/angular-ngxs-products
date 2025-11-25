export interface Product {
  id?: number; // json-server gera id ao criar se não informado
  name: string;
}

export interface ProductStateModel {
  products: Product[];
  loading: boolean; // para indicar carregamento
  error?: string | null; // campo para mensagens de erro
}
