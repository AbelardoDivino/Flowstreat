import { useState } from 'react';
import { payBoleto } from '../components/services/paymentService';

export default function BoletoPayment({ orderId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setError('');
    try {
      const res = await payBoleto(orderId);
      setData(res);
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="border border-linha rounded-[3px] p-4 bg-white">
      <h4 className="font-display text-lg">Boleto</h4>
      {!data ? <button onClick={handleGenerate} className="mt-2 bg-fluxo text-white px-6 py-2 rounded-[3px] font-semibold">Gerar boleto</button> : (
        <div className="mt-2">
          {data.barcode && <p className="break-all bg-base border border-linha rounded-[3px] p-2 text-sm">{data.barcode} <button onClick={() => navigator.clipboard.writeText(data.barcode)} className="text-fluxo font-semibold ml-2">Copiar</button></p>}
          {data.ticket_url && <p className="mt-2"><a href={data.ticket_url} target="_blank" rel="noreferrer" className="text-fluxo font-semibold">Baixar boleto em PDF</a></p>}
          <p className="text-sm text-poeira mt-2">Status: {data.status}</p>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  );
}
