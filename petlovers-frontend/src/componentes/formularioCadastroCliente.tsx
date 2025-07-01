import React, { useState } from 'react';
import { apiClientes } from '../api';

// Tipos para o payload do formulário
type CreateRgPayload = {
    numero: string;
    dataEmissao: string;
};

type CreatePetPayload = {
    nome: string;
    tipo: string;
    raca: string;
    genero: string;
};

type CreateClientePayload = {
    nome: string;
    nomeSocial: string;
    email: string;
    cpf: string;
    telefones: Array<{ numero: string }>;
    rgs: Array<CreateRgPayload>;
    pets: Array<CreatePetPayload>;
};

type Props = {
    tema: string;
    onClienteCadastrado: () => void;
}

export default function FormularioCadastroCliente(props: Props) {
    const { tema, onClienteCadastrado } = props;

    // Estados do formulário
    const [nome, setNome] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefones, setTelefones] = useState(['']); // Lógica nova para múltiplos telefones

    const [rgs, setRgs] = useState<CreateRgPayload[]>([]);
    const [rgTemp, setRgTemp] = useState<CreateRgPayload>({ numero: '', dataEmissao: '' });

    const [pets, setPets] = useState<CreatePetPayload[]>([]);
    const [petTemp, setPetTemp] = useState<CreatePetPayload>({ nome: '', tipo: '', raca: '', genero: 'Macho' });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Funções auxiliares para gerenciar os campos dinâmicos
    const handleTelefoneChange = (index: number, value: string) => {
        const novosTelefones = [...telefones];
        novosTelefones[index] = value;
        setTelefones(novosTelefones);
    };
    const adicionarTelefone = () => setTelefones([...telefones, '']);
    const removerTelefone = (index: number) => {
        if (telefones.length > 1) setTelefones(telefones.filter((_, i) => i !== index));
    };

    const handleRgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRgTemp(prev => ({ ...prev, [name]: value }));
    };
    const adicionarRg = () => {
        if (!rgTemp.numero || !rgTemp.dataEmissao) return;
        setRgs(prevRgs => [...prevRgs, rgTemp]);
        setRgTemp({ numero: '', dataEmissao: '' });
    };
    const removerRg = (indexToRemove: number) => {
        setRgs(prevRgs => prevRgs.filter((_, index) => index !== indexToRemove));
    };

    const handlePetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPetTemp(prev => ({ ...prev, [name]: value }));
    };
    const adicionarPet = () => {
        if (!petTemp.nome || !petTemp.raca || !petTemp.tipo) return;
        setPets(prevPets => [...prevPets, petTemp]);
        setPetTemp({ nome: '', tipo: '', raca: '', genero: 'Macho' });
    };
    const removerPet = (indexToRemove: number) => {
        setPets(prevPets => prevPets.filter((_, index) => index !== indexToRemove));
    };

    // Lógica de submissão da versão nova
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const dadosCliente: CreateClientePayload = {
            nome,
            nomeSocial,
            email,
            cpf,
            telefones: telefones.map(numero => ({ numero })),
            rgs: rgs.map(rg => ({ ...rg, dataEmissao: new Date(rg.dataEmissao).toISOString() })),
            pets
        };

        try {
            await apiClientes.criar(dadosCliente);
            alert('Cliente cadastrado com sucesso!');
            onClienteCadastrado();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao cadastrar cliente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // JSX com a estilização da versão antiga
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Cadastro de Cliente</h5>
            </div>
            <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Seção Dados Pessoais */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-3"><i className="bi bi-person-lines-fill me-2" style={{ color: tema }}></i>Dados Pessoais</h6>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="form-label small fw-semibold">Nome Completo*</label><input type="text" className="form-control rounded-2" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Nome Social</label><input type="text" className="form-control rounded-2" value={nomeSocial} onChange={(e) => setNomeSocial(e.target.value)} /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Email*</label><input type="email" className="form-control rounded-2" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">CPF*</label><input type="text" className="form-control rounded-2" value={cpf} onChange={(e) => setCpf(e.target.value)} required /></div>
                        </div>
                    </div>

                    {/* Seção Telefones (com a lógica nova de múltiplos telefones) */}
                    <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
                        <h6 className="fw-bold text-muted mb-3"><i className="bi bi-telephone-fill me-2" style={{ color: tema }}></i>Telefones</h6>
                        {telefones.map((telefone, index) => (
                            <div key={index} className="input-group mb-2">
                                <input type="tel" className="form-control" placeholder="Ex: (12) 34567-8901" value={telefone} onChange={(e) => handleTelefoneChange(index, e.target.value)} required />
                                {telefones.length > 1 && <button className="btn btn-outline-danger" type="button" onClick={() => removerTelefone(index)}><i className="bi bi-trash"></i></button>}
                            </div>
                        ))}
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={adicionarTelefone}>Adicionar outro telefone</button>
                    </div></div>

                    {/* Seção RGs */}
                    <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
                        <h6 className="fw-bold text-muted mb-3"><i className="bi bi-person-badge me-2" style={{ color: tema }}></i>Documentos de RG</h6>
                        {rgs.length > 0 && <div className="mb-3">{rgs.map((rg, index) => (<div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 rounded-2" style={{ backgroundColor: '#f8f9fa' }}><div><span className="fw-semibold">{rg.numero}</span><small className="text-muted ms-2"><i className="bi bi-calendar me-1"></i>{new Date(rg.dataEmissao + 'T00:00:00').toLocaleDateString()}</small></div><button type="button" className="btn btn-outline-danger btn-sm rounded-2" onClick={() => removerRg(index)} title="Remover RG"><i className="bi bi-trash"></i></button></div>))}</div>}
                        <div className="row g-3">
                            <div className="col-md-5"><label className="form-label small fw-semibold">Número do RG</label><input type="text" className="form-control rounded-2" name="numero" value={rgTemp.numero} onChange={handleRgChange} /></div>
                            <div className="col-md-5"><label className="form-label small fw-semibold">Data de Emissão</label><input type="date" className="form-control rounded-2" name="dataEmissao" value={rgTemp.dataEmissao} onChange={handleRgChange} /></div>
                            <div className="col-md-2 d-flex align-items-end"><button type="button" className="btn btn-sm w-100 rounded-2" style={{ backgroundColor: tema, color: 'white' }} onClick={adicionarRg} disabled={!rgTemp.numero || !rgTemp.dataEmissao}><i className="bi bi-plus-lg"></i></button></div>
                        </div>
                    </div></div>

                    {/* Seção Pets */}
                    <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
                         <h6 className="fw-bold text-muted mb-3"><i className="bi bi-heart me-2" style={{ color: tema }}></i>Pets do Cliente</h6>
                        {pets.length > 0 && <div className="mb-3">{pets.map((pet, index) => (<div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 rounded-2" style={{ backgroundColor: '#f8f9fa' }}><div><span className="fw-semibold">{pet.nome}</span><small className="text-muted ms-2">{pet.tipo} • {pet.raca} • {pet.genero}</small></div><button type="button" className="btn btn-outline-danger btn-sm rounded-2" onClick={() => removerPet(index)} title="Remover Pet"><i className="bi bi-trash"></i></button></div>))}</div>}
                        <div className="row g-3 mb-3">
                            <div className="col-md-4"><label className="form-label small fw-semibold">Nome do Pet</label><input type="text" className="form-control rounded-2" name="nome" value={petTemp.nome} onChange={handlePetChange} /></div>
                            <div className="col-md-3"><label className="form-label small fw-semibold">Tipo</label><input type="text" className="form-control rounded-2" name="tipo" value={petTemp.tipo} onChange={handlePetChange} placeholder="Ex: Cão, Gato..." /></div>
                            <div className="col-md-3"><label className="form-label small fw-semibold">Raça</label><input type="text" className="form-control rounded-2" name="raca" value={petTemp.raca} onChange={handlePetChange} /></div>
                            <div className="col-md-2"><label className="form-label small fw-semibold">Gênero</label><select className="form-select rounded-2" name="genero" value={petTemp.genero} onChange={handlePetChange}><option value="Macho">Macho</option><option value="Fêmea">Fêmea</option></select></div>
                        </div>
                        <button type="button" className="btn btn-sm rounded-2 w-100" style={{ backgroundColor: tema, color: 'white' }} onClick={adicionarPet} disabled={!petTemp.nome}><i className="bi bi-plus-circle me-2"></i>Adicionar Pet</button>
                    </div></div>

                    {/* Botão de Submissão */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-lg rounded-2 fw-bold" style={{ backgroundColor: tema, color: 'white' }} disabled={isSubmitting}>
                            {isSubmitting ? 'Cadastrando...' : <><i className="bi bi-save me-2"></i>Cadastrar Cliente</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}