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
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <h4>Boleto</h4>
      {!data ? <button onClick={handleGenerate}>Gerar Boleto</button> : (
        <div>
          {data.barcode && <p style={{ wordBreak: 'break-all', background: '#eee', padding: 8 }}>{data.barcode} <button onClick={() => navigator.clipboard.writeText(data.barcode)}>Copiar</button></p>}
          {data.ticket_url && <p><a href={data.ticket_url} target="_blank" rel="noreferrer">Baixar boleto em PDF</a></p>}
          <p>Status: {data.status}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
