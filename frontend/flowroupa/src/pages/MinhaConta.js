import ProfileForm from '../account/ProfileForm';
import AddressList from '../account/AddressList';

export default function MinhaConta() {
  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Minha Conta</h1>
      <ProfileForm />
      <h3 style={{ marginTop: 20 }}>Meus Endereços</h3>
      <AddressList />
    </div>
  );
}
