import React, { useState, useEffect } from 'react';
import { Cliente, CreatePet } from "./dados";

type Props = {
    tema: string;
    cliente?: Cliente | null;
    clientes?: Cliente[];
    onSubmit: (pet: CreatePet, donoId: number) => void;
}

export default function FormularioCadastroPet(props: Props) {
    const { tema, cliente, clientes = [], onSubmit } = props;

    // Lógica nova de seleção por ID
    const [donoId, setDonoId] = useState<string>(cliente?.id?.toString() ?? '');
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [raca, setRaca] = useState('');
    const [genero, setGenero] = useState('Macho');

    useEffect(() => {
        setDonoId(cliente?.id?.toString() ?? '');
    }, [cliente]);

    // Lógica de submissão nova
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!donoId) {
            alert('Por favor, selecione o dono do pet.');
            return;
        }
        const novoPet: CreatePet = { nome, tipo, raca, genero };
        onSubmit(novoPet, Number(donoId));
    };

    // JSX com estilização antiga
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold">
                    <i className="bi bi-heart-fill me-2"></i>
                    {cliente ? `Cadastrar Pet para ${cliente.nome}` : 'Cadastrar Pet'}
                </h5>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    {!cliente && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-muted mb-3"><i className="bi bi-person-fill me-2" style={{ color: tema }}></i>Dono do Pet</h6>
                            <select className="form-select rounded-2" value={donoId} onChange={(e) => setDonoId(e.target.value)} required>
                                <option value="">Selecione um cliente...</option>
                                {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome} ({c.cpf})</option>))}
                            </select>
                        </div>
                    )}
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-3"><i className="bi bi-info-circle-fill me-2" style={{ color: tema }}></i>Dados do Pet</h6>
                        <div className="row g-3">
                            <div className="col-md-12"><label className="form-label small fw-semibold">Nome do Pet*</label><input type="text" className="form-control rounded-2" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Tipo*</label><input type="text" className="form-control rounded-2" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Cão, Gato..." required /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Raça*</label><input type="text" className="form-control rounded-2" value={raca} onChange={(e) => setRaca(e.target.value)} required /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Gênero*</label><select className="form-select rounded-2" value={genero} onChange={(e) => setGenero(e.target.value)} required><option value="Macho">Macho</option><option value="Fêmea">Fêmea</option></select></div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <button type="submit" className="btn rounded-2 fw-bold" style={{ backgroundColor: tema, color: 'white' }} disabled={!donoId}><i className="bi bi-save me-2"></i>Cadastrar Pet</button>
                    </div>
                </form>
            </div>
        </div>
    );
}