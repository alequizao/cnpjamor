
import type { CnpjInfo } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CalendarDays, CheckCircle, Info, MapPin, Phone, Mail, Briefcase, DollarSign, XCircle, Sparkles, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { summarizeBusiness, SummarizeBusinessInput } from '@/ai/flows/summarize-business-flow';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface CnpjDisplayProps {
  data: CnpjInfo;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value?: string | React.ReactNode }> = ({ icon, label, value }) => {
  if (!value && typeof value !== 'boolean' && value !== 0) return null; // Allow boolean false and 0 to be displayed
  return (
    <div className="flex items-start space-x-3 py-2 border-b border-pink-100 last:border-b-0">
      <span className="text-primary mt-1">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

export function CnpjDisplay({ data }: CnpjDisplayProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setSummaryError(null);
    setSummary(null);

    const input: SummarizeBusinessInput = {
      atividadePrincipal: data.atividadePrincipal.descricao,
      atividadesSecundarias: data.atividadesSecundarias?.map(act => act.descricao),
    };

    try {
      const result = await summarizeBusiness(input);
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaryError(error instanceof Error ? error.message : "Falha ao gerar o resumo. Tente novamente.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const fullAddress = `${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''} - ${data.bairro}, ${data.municipio} - ${data.uf}, CEP: ${data.cep}`;

  return (
    <Card className="w-full shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-secondary/30 p-6">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-xl md:text-2xl text-primary-foreground [--primary-foreground:hsl(var(--primary))]">
              {data.nomeFantasia || data.razaoSocial}
            </CardTitle>
            <CardDescription className="text-sm">{data.cnpj}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <DetailItem icon={<Info size={18} />} label="Razão Social" value={data.razaoSocial} />
        {data.nomeFantasia && data.nomeFantasia !== data.razaoSocial && (
          <DetailItem icon={<Info size={18} />} label="Nome Fantasia" value={data.nomeFantasia} />
        )}
        <DetailItem 
          icon={data.situacao === "ATIVA" ? <CheckCircle size={18} className="text-green-500"/> : <XCircle size={18} className="text-red-500"/>} 
          label="Situação Cadastral" 
          value={<span className={data.situacao === "ATIVA" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{data.situacao}</span>} 
        />
        <DetailItem icon={<CalendarDays size={18} />} label="Data de Abertura" value={data.dataAbertura} />
        <DetailItem icon={<MapPin size={18} />} label="Endereço Completo" value={fullAddress} />
        <DetailItem icon={<Briefcase size={18} />} label="Atividade Principal" value={`${data.atividadePrincipal.codigo} - ${data.atividadePrincipal.descricao}`} />
        
        {data.atividadesSecundarias && data.atividadesSecundarias.length > 0 && (
          <div className="py-2 border-b border-pink-100">
            <div className="flex items-start space-x-3">
                <Briefcase size={18} className="text-primary mt-1" />
                <div>
                    <p className="text-xs text-muted-foreground">Atividades Secundárias</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {data.atividadesSecundarias.map(activity => (
                        <li key={activity.codigo} className="text-sm">{`${activity.codigo} - ${activity.descricao}`}</li>
                      ))}
                    </ul>
                </div>
            </div>
          </div>
        )}
        
        <DetailItem icon={<Info size={18} />} label="Natureza Jurídica" value={data.naturezaJuridica} />
        {data.capitalSocial && <DetailItem icon={<DollarSign size={18} />} label="Capital Social" value={`R$ ${parseFloat(data.capitalSocial).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />}
        {data.telefone && <DetailItem icon={<Phone size={18} />} label="Telefone" value={data.telefone} />}
        {data.email && <DetailItem icon={<Mail size={18} />} label="E-mail" value={<a href={`mailto:${data.email}`} className="text-primary hover:underline">{data.email}</a>} />}
      </CardContent>

      <CardFooter className="p-6 flex flex-col items-start gap-4 bg-gray-50/50 border-t">
        <Button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="w-full sm:w-auto">
          {isLoadingSummary ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoadingSummary ? "Gerando Resumo..." : "Gerar Resumo com IA 💖"}
        </Button>

        {summary && (
          <Alert variant="default" className="w-full bg-primary/10 border-primary/30">
            <Sparkles className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-semibold">Resumo do Negócio (IA)</AlertTitle>
            <AlertDescription className="text-foreground/90">
              {summary}
            </AlertDescription>
          </Alert>
        )}

        {summaryError && (
          <Alert variant="destructive" className="w-full">
            <XCircle className="h-5 w-5" />
            <AlertTitle>Erro ao Gerar Resumo</AlertTitle>
            <AlertDescription>
              {summaryError}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
