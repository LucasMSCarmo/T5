import React, { useState, useEffect } from 'react';
import { Cliente, UpdateCliente, RG } from "./dados";

type Props = {
    tema: string;
    cliente: Cliente;
    onSalvar: (clienteAtualizado: UpdateCliente) => void;
    onFechar: () => void;
}

export default function FormularioEdicaoCliente(props: Props) {
    const { tema, cliente, onSalvar, onFechar } = props;

    // Lógica de estado da versão nova
    const [nome, setNome] = useState(cliente.nome);
    const [nomeSocial, setNomeSocial] = useState(cliente.nomeSocial || '');
    const [email, setEmail] = useState(cliente.email || '');
    const [telefones, setTelefones] = useState(cliente.telefones.map(t => t.numero));
    const [rgs, setRgs] = useState(cliente.rgs.map(rg => ({ numero: rg.numero, dataEmissao: new Date(rg.dataEmissao).toISOString().split('T')[0] })));
    const [rgTemp, setRgTemp] = useState({ numero: '', dataEmissao: '' });
    
    useEffect(() => {
        setNome(cliente.nome);
        setNomeSocial(cliente.nomeSocial || '');
        setEmail(cliente.email || '');
        setTelefones(cliente.telefones.map(t => t.numero));
        setRgs(cliente.rgs.map(rg => ({ numero: rg.numero, dataEmissao: new Date(rg.dataEmissao).toISOString().split('T')[0] })));
    }, [cliente]);

    // Funções auxiliares da versão nova
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
        setRgTemp({ ...rgTemp, [e.target.name]: e.target.value });
    };
    const adicionarRg = () => {
        if (!rgTemp.numero || !rgTemp.dataEmissao) return;
        setRgs([...rgs, rgTemp]);
        setRgTemp({ numero: '', dataEmissao: '' });
    };
    const removerRg = (index: number) => setRgs(rgs.filter((_, i) => i !== index));

    // Lógica de submissão da versão nova
    const handleSalvar = (event: React.FormEvent) => {
        event.preventDefault();
        const clienteEditado: UpdateCliente = {
            id: cliente.id!,
            nome,
            nomeSocial,
            email,
            telefones: telefones.map(numero => ({ numero })),
            rgs: rgs.map(rg => ({ numero: rg.numero, dataEmissao: new Date(rg.dataEmissao) })),
        };
        onSalvar(clienteEditado);
    };

    // JSX com a estilização da versão antiga
    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                        <h5 className="modal-title fw-bold"><i className="bi bi-pencil-square me-2"></i>Editando Cliente: {cliente.nome}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onFechar}></button>
                    </div>
                    <form onSubmit={handleSalvar}>
                        <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="mb-4">
                                <h6 className="fw-bold text-muted mb-3"><i className="bi bi-person-lines-fill me-2" style={{ color: tema }}></i>Dados Pessoais</h6>
                                <div className="row g-3">
                                    <div className="col-md-6"><label className="form-label small fw-semibold">Nome Completo*</label><input type="text" className="form-control rounded-2" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
                                    <div className="col-md-6"><label className="form-label small fw-semibold">Nome Social</label><input type="text" className="form-control rounded-2" value={nomeSocial} onChange={(e) => setNomeSocial(e.target.value)} /></div>
                                    <div className="col-md-6"><label className="form-label small fw-semibold">Email*</label><input type="email" className="form-control rounded-2" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                                    <div className="col-md-6"><label className="form-label small fw-semibold">CPF*</label><input type="text" className="form-control rounded-2" value={cliente.cpf} disabled /></div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
                                <h6 className="fw-bold text-muted mb-3"><i className="bi bi-telephone-fill me-2" style={{ color: tema }}></i>Telefones</h6>
                                {telefones.map((telefone, index) => (
                                    <div key={index} className="input-group mb-2">
                                        <input type="tel" className="form-control rounded-start-2" value={telefone} onChange={(e) => handleTelefoneChange(index, e.target.value)} />
                                        {telefones.length > 1 && <button className="btn btn-outline-danger rounded-end-2" type="button" onClick={() => removerTelefone(index)}><i className="bi bi-trash"></i></button>}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={adicionarTelefone}>Adicionar Telefone</button>
                            </div></div>
                            <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
                                <h6 className="fw-bold text-muted mb-3"><i className="bi bi-person-badge me-2" style={{ color: tema }}></i>Documentos de RG</h6>
                                {rgs.length > 0 && <div className="mb-3">{rgs.map((rg, index) => (<div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 rounded-2" style={{ backgroundColor: '#f8f9fa' }}><div><span className="fw-semibold">{rg.numero}</span><small className="text-muted ms-2"><i className="bi bi-calendar me-1"></i>{new Date(rg.dataEmissao + 'T00:00:00').toLocaleDateString()}</small></div><button type="button" className="btn btn-outline-danger btn-sm rounded-2" onClick={() => removerRg(index)}><i className="bi bi-trash"></i> Remover</button></div>))}</div>}
                                <div className="row g-3">
                                    <div className="col-md-5"><label className="form-label small fw-semibold">Número do RG</label><input type="text" className="form-control rounded-2" name="numero" value={rgTemp.numero} onChange={handleRgChange} /></div>
                                    <div className="col-md-5"><label className="form-label small fw-semibold">Data de Emissão</label><input type="date" className="form-control rounded-2" name="dataEmissao" value={rgTemp.dataEmissao} onChange={handleRgChange} /></div>
                                    <div className="col-md-2 d-flex align-items-end"><button type="button" className="btn btn-sm w-100 rounded-2" style={{ backgroundColor: tema, color: 'white' }} onClick={adicionarRg} disabled={!rgTemp.numero || !rgTemp.dataEmissao}><i className="bi bi-plus-lg me-1"></i> Adicionar</button></div>
                                </div>
                            </div></div>
                        </div>
                        <div className="modal-footer border-top-0">
                            <button type="button" className="btn btn-outline-secondary rounded-2 fw-semibold" onClick={onFechar}><i className="bi bi-x-circle me-2"></i>Cancelar</button>
                            <button type="submit" className="btn rounded-2 fw-bold" style={{ backgroundColor: tema, color: 'white', padding: '0.5rem 1.5rem' }}><i className="bi bi-save me-2"></i>Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}