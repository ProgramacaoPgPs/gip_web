import { useState, useCallback } from 'react';
import { Connection } from '../../../Connection/Connection';
import { useMyContext } from '../../../Context/MainContext';

type SendDataMethod = 'GET' | 'POST' | 'PUT';
type SendDataResponse = {
  data: any;
  error: string | null;
};

export const useSendData = (notification: any) => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<SendDataResponse | null>(null);
  const {setLoading,loading} = useMyContext();
  
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
        let url = endpoint;
        if (method === 'GET' && bodyData) {
          const queryParams = new URLSearchParams(bodyData as any).toString();
          url = `${endpoint}?${queryParams}`;
        }
        const methodAction = method.toLowerCase();
        // @ts-ignore
        const res = await connection[methodAction](bodyData, url);
        if (resetData && (method === 'POST' || method === 'PUT')) resetData();
        setResponse({ data: res, error: null });
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
        setResponse({ data: null, error: err.message || 'Erro desconhecido' });
      } finally {
        notification("Erro ao enviar dados!", "", "error");
        setLoading(false);
      }
    },
    [notification]
  );

  return {
    sendData,
    loading,
    error,
    response,
  };
};
