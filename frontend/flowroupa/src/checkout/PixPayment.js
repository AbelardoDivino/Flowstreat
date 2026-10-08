import { useEffect, useState } from 'react';
import { payPix } from '../components/services/paymentService';
import { getOrderById } from '../components/services/orderService';

function friendlyPixError(message) {
  if (/communication_error|internal_error|timeout|network|failed to fetch/i.test(message || '')) {
    return 'Pix indisponível agora. Pague com cartão ou boleto sem sair desta tela.';
  }
  return message;
}

export default function PixPayment({ orderId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await payPix(orderId);
      setData(res);
      setPolling(true);
    } catch (e) { setError(friendlyPixError(e.message)); }
    finally { setLoading(false); }
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
    <div className="border border-linha rounded-[3px] p-4 bg-white">
      <h4 className="font-display text-lg">Pix</h4>
      {!data ? <button onClick={handleGenerate} disabled={loading} className="btn btn-primary mt-2">{loading ? 'Gerando...' : 'Gerar QR Code Pix'}</button> : (
        <div className="mt-2">
          {data.qr_code && <img src={`data:image/png;base64,${data.qr_code}`} alt="QR Code do Pix para pagamento" className="w-48" />}
          {data.qr_code_text && <p className="break-all bg-base border border-linha rounded-[3px] p-2 mt-2 text-sm">{data.qr_code_text} <button onClick={() => navigator.clipboard.writeText(data.qr_code_text)} className="text-fluxo font-semibold ml-2">Copiar</button></p>}
          {polling ? <p role="status" className="text-sm text-poeira mt-2">Aguardando pagamento... (verificando a cada 5s)</p> : <p role="status" className="text-sm text-green-700 font-semibold mt-2">Pagamento confirmado!</p>}
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  );
}
