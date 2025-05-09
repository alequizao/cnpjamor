"use server";

import type { CnpjInfo, CnpjApiError } from '@/lib/types';

// Mock CNPJ database
const mockCnpjDatabase: Record<string, CnpjInfo> = {
  "00000000000191": {
    cnpj: "00.000.000/0001-91",
    razaoSocial: "EMPRESA MODELO LTDA",
    nomeFantasia: "FANTASIA MODELO",
    dataAbertura: "01/01/2000",
    situacao: "ATIVA",
    naturezaJuridica: "206-2 - Sociedade Empresária Limitada",
    logradouro: "RUA EXEMPLO FICTÍCIO",
    numero: "123",
    complemento: "SALA 10",
    bairro: "CENTRO MODELO",
    municipio: "CIDADE EXEMPLO",
    uf: "EX",
    cep: "00000-000",
    telefone: "(00) 0000-0000",
    email: "contato@empresamodelo.com.br",
    atividadePrincipal: {
      codigo: "62.01-5-01",
      descricao: "Desenvolvimento de programas de computador sob encomenda",
    },
    atividadesSecundarias: [
      {
        codigo: "62.04-0-00",
        descricao: "Consultoria em tecnologia da informação",
      },
    ],
    capitalSocial: "100000.00"
  },
  "11111111000111": {
    cnpj: "11.111.111/0001-11",
    razaoSocial: "AMOR & DOCES CONFEITARIA ME",
    nomeFantasia: "DOCERIA CORAÇÃO",
    dataAbertura: "15/02/2010",
    situacao: "ATIVA",
    naturezaJuridica: "213-5 - Empresário (Individual)",
    logradouro: "AV ROSA PERFEITA",
    numero: "456",
    bairro: "JARDIM DAS FLORES",
    municipio: "FLORIANÓPOLIS",
    uf: "SC",
    cep: "88000-100",
    telefone: "(48) 9999-8888",
    email: "doceriacoracao@email.com",
    atividadePrincipal: {
      codigo: "10.91-1-02",
      descricao: "Fabricação de produtos de padaria e confeitaria com predominância de produção própria",
    },
    capitalSocial: "10000.00"
  }
};

export async function fetchCnpjData(rawCnpj: string): Promise<CnpjInfo | CnpjApiError> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cnpj = rawCnpj.replace(/\D/g, ''); // Remove non-digits

      if (cnpj.length !== 14) {
        resolve({ message: "CNPJ inválido. Deve conter 14 dígitos." });
        return;
      }
      
      const data = mockCnpjDatabase[cnpj];

      if (data) {
        resolve(data);
      } else {
        resolve({ message: "CNPJ não encontrado na base de dados modelo.", status: 404 });
      }
    }, 1500); // Simulate network delay
  });
}
