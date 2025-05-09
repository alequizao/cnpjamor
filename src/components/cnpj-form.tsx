"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchCnpjData } from "@/app/actions";
import type { CnpjInfo, CnpjApiError } from "@/lib/types";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";

const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

const FormSchema = z.object({
  cnpj: z.string().refine((val) => cnpjRegex.test(val), {
    message: "Formato de CNPJ inválido. Use XX.XXX.XXX/XXXX-XX.",
  }),
});

interface CnpjFormProps {
  onCnpjDataFetched: (data: CnpjInfo | null, error?: string) => void;
}

export function CnpjForm({ onCnpjDataFetched }: CnpjFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cnpj: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    onCnpjDataFetched(null); // Clear previous results

    try {
      const result = await fetchCnpjData(data.cnpj);
      if ('message' in result && (result as CnpjApiError).message) { // Type guard for error
        const errorResult = result as CnpjApiError;
        toast({
          title: "Erro na Consulta",
          description: errorResult.message,
          variant: "destructive",
        });
        onCnpjDataFetched(null, errorResult.message);
      } else {
        onCnpjDataFetched(result as CnpjInfo);
        toast({
          title: "Sucesso!",
          description: "CNPJ consultado com sucesso.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({
        title: "Erro na Consulta",
        description: errorMessage,
        variant: "destructive",
      });
      onCnpjDataFetched(null, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const formatCnpj = (value: string) => {
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length <= 2) return cnpj;
    if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">CNPJ</FormLabel>
              <FormControl>
                <Input
                  placeholder="00.000.000/0000-00"
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatCnpj(e.target.value));
                  }}
                  className="text-base py-6 rounded-lg shadow-sm"
                  maxLength={18}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6 rounded-lg animate-subtle-pulse shadow-lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Consultando..." : "Consultar CNPJ"}
        </Button>
      </form>
    </Form>
  );
}
