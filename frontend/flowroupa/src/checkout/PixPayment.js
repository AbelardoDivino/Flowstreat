import { useEffect, useState } from 'react';
import { payPix } from '../components/services/paymentService';
import { getOrderById } from '../components/services/orderService';

export default function PixPayment({ orderId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);

  async function handleGenerate() {
    setError('');
    try {
      const res = await payPix(orderId);
      setData(res);
      setPolling(true);
    } catch (e) { setError(e.message); }
  }

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(async () => {
      try {
        const order = await getOrderById(orderId);
        if (order.paymentStatus === 'paid') { setPolling(false); clearInterval(id); }
      } catch {}
    }, 5000);
    return () => clearInterval(id);
  }, [polling, orderId]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <h4>Pix</h4>
      {!data ? <button onClick={handleGenerate}>Gerar QR Code Pix</button> : (
        <div>
          {data.qr_code && <img src={`data:image/png;base64,${data.qr_code}`} alt="Pix QR" style={{ width: 200 }} />}
          {data.qr_code_text && <p style={{ wordBreak: 'break-all', background: '#eee', padding: 8 }}>{data.qr_code_text} <button onClick={() => navigator.clipboard.writeText(data.qr_code_text)}>Copiar</button></p>}
          {polling ? <p>Aguardando pagamento... (polling a cada 5s)</p> : <p style={{ color: 'green' }}>Pagamento confirmado!</p>}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
