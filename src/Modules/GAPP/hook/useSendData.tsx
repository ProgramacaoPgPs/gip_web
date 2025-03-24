import { useState, useCallback } from 'react';
import { Connection } from '../../../Connection/Connection';

type SendDataMethod = 'GET' | 'POST' | 'PUT';
type SendDataResponse = {
  data: any;
  error: string | null;
};

export const useSendData = (handleNotification: (message: string, details: string, type: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<SendDataResponse | null>(null);
  const sendData = useCallback(
    async (
      method: SendDataMethod,
      endpoint: string,
      bodyData?: Record<string, any>,  
      resetData?: () => void           
    ) => {
      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        const connection = new Connection("15");
        let body: Record<string, any> | undefined = undefined;
        let url = endpoint;
        if (method === 'GET' && bodyData) {
          const queryParams = new URLSearchParams(bodyData as any).toString();
          url = `${endpoint}?${queryParams}`;
        } else if (method === 'POST' || method === 'PUT') {
          body = {
            ...bodyData,
            ...(method === 'PUT' && { id: bodyData?.id }),
          };
        }
        const methodAction = method.toLowerCase();
        // @ts-ignore
        const res = await connection[methodAction](body, url);
        if (resetData && (method === 'POST' || method === 'PUT')) resetData();
        setResponse({ data: res, error: null });
        handleNotification(
          `Dado ${method === 'POST' ? 'salvo' : method === 'PUT' ? 'atualizado' : 'recuperado'} com sucesso!`,
           "",
           method === 'POST' ? "success" : method === 'PUT' ? "warning" : "info"
        );
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
        setResponse({ data: null, error: err.message || 'Erro desconhecido' });
        handleNotification("Erro ao enviar dados!", err.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [handleNotification]
  );

  return {
    sendData,
    loading,
    error,
    response,
  };
};
