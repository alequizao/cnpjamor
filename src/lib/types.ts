export interface CnpjInfo {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  dataAbertura: string;
  situacao: string;
  naturezaJuridica: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone?: string;
  email?: string;
  atividadePrincipal: { codigo: string; descricao: string };
  atividadesSecundarias?: Array<{ codigo: string; descricao: string }>;
  capitalSocial?: string;
}

export interface CnpjApiError {
  message: string;
  status?: number;
}
