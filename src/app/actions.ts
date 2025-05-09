
"use server";

import type { CnpjInfo, CnpjApiError } from '@/lib/types';

// Interface for the raw API response from ReceitaWS to help with mapping
interface ReceitaWsResponse {
  // Main company data
  cnpj: string;
  nome: string; // razaoSocial
  fantasia?: string; // nomeFantasia
  abertura: string; // dataAbertura
  situacao: string;
  natureza_juridica: string; // naturezaJuridica
  
  // Address
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;

  // Contact
  telefone?: string;
  email?: string;

  // Activities
  atividade_principal: Array<{ code: string; text: string }>;
  atividades_secundarias?: Array<{ code: string; text: string }>;
  
  // Financial
  capital_social?: string;

  // API status fields
  status?: string; // "OK" or "ERROR"
  message?: string; // Error message if status is "ERROR"
  
  // Other fields that might be present but not used in CnpjInfo
  tipo?: string;
  data_situacao?: string;
  motivo_situacao?: string;
  situacao_especial?: string;
  data_situacao_especial?: string;
  efr?: string;
  ultima_atualizacao?: string;
  qsa?: any[]; // Quadro de Sócios e Administradores
  billing?: { free: boolean; database: boolean };
}


export async function fetchCnpjData(rawCnpj: string): Promise<CnpjInfo | CnpjApiError> {
  const cnpj = rawCnpj.replace(/\D/g, ''); // Remove non-digits

  if (cnpj.length !== 14) {
    return { message: "CNPJ inválido. Deve conter 14 dígitos." };
  }

  const apiUrl = `https://receitaws.com.br/v1/cnpj/${cnpj}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // ReceitaWS free tier can be slow or rate limit, good to have a timeout
      // However, fetch in Node.js (used by Server Actions) doesn't have a direct timeout option like client-side fetch or curl.
      // AbortController can be used for timeouts. For simplicity, we'll rely on default fetch behavior.
      // Consider adding timeout logic for production if needed.
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 429 Too Many Requests, 5xx)
      if (response.status === 404) {
        return { message: "CNPJ não encontrado na Receita Federal.", status: 404 };
      }
      if (response.status === 429) {
        return { message: "Muitas requisições. Por favor, tente novamente mais tarde.", status: 429 };
      }
      // Try to parse error message if API provides one in JSON format for other errors
      try {
        const errorData: ReceitaWsResponse = await response.json();
        return { message: errorData.message || `Erro na API: ${response.statusText}`, status: response.status };
      } catch (e) {
        // If error response is not JSON
        return { message: `Erro ao consultar o CNPJ. Status: ${response.status}`, status: response.status };
      }
    }

    const data: ReceitaWsResponse = await response.json();

    if (data.status === "ERROR") {
      return { message: data.message || "Erro retornado pela API da ReceitaWS.", status: response.status };
    }
    
    // Check for essential fields to consider it a valid CNPJ response
    if (!data.cnpj || !data.nome || !data.atividade_principal || data.atividade_principal.length === 0) {
        return { message: "Resposta da API incompleta ou CNPJ inválido.", status: 404 };
    }


    const cnpjInfo: CnpjInfo = {
      cnpj: data.cnpj,
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia,
      dataAbertura: data.abertura,
      situacao: data.situacao,
      naturezaJuridica: data.natureza_juridica,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      municipio: data.municipio,
      uf: data.uf,
      cep: data.cep,
      telefone: data.telefone,
      email: data.email,
      atividadePrincipal: {
        codigo: data.atividade_principal[0].code,
        descricao: data.atividade_principal[0].text,
      },
      atividadesSecundarias: data.atividades_secundarias?.map(activity => ({
        codigo: activity.code,
        descricao: activity.text,
      })),
      capitalSocial: data.capital_social,
    };

    return cnpjInfo;

  } catch (error) {
    console.error("Fetch CNPJ Error:", error);
    if (error instanceof Error && error.name === 'AbortError') {
        return { message: "A consulta demorou muito e foi cancelada. Tente novamente." };
    }
    return { message: "Falha na comunicação com a API de consulta de CNPJ. Verifique sua conexão ou tente mais tarde." };
  }
}
