export interface IProduct {
  id?: number; // json-server gera id ao criar se não informado
  name: string;
}

export interface IProductStateModel {
  products: IProduct[];
  loading: boolean; // para indicar carregamento
  error?: string | null; // campo para mensagens de erro
}
