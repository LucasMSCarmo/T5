import React, { useState } from 'react';
import { CreateProduto } from "./dados";

type Props = {
    tema: string;
    onSubmit: (produto: CreateProduto) => void;
}

export default function FormularioCadastroProduto(props: Props) {
    const { tema, onSubmit } = props;

    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [tipo, setTipo] = useState('');

    // Lógica de submissão da versão nova
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !preco || !tipo) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        onSubmit({ nome, preco: parseFloat(preco), tipo });
    }

    // JSX com estilização da versão antiga
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold"><i className="bi bi-cart-plus-fill me-2"></i>Cadastro de Produto</h5>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-3"><i className="bi bi-info-circle me-2" style={{ color: tema }}></i>Informações do Produto</h6>
                        <div className="row g-3">
                            <div className="col-md-12"><label className="form-label small fw-semibold">Nome do Produto*</label><input type="text" className="form-control rounded-2" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Preço (R$)*</label><div className="input-group"><span className="input-group-text">R$</span><input type="number" step="0.01" min="0" className="form-control" value={preco} onChange={(e) => setPreco(e.target.value)} required /></div></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Tipo de Produto*</label><select className="form-select rounded-2" value={tipo} onChange={(e) => setTipo(e.target.value)} required><option value="">Selecione...</option><option value="Alimento">Alimento</option><option value="Higiene">Higiene</option><option value="Brinquedo">Brinquedo</option><option value="Acessório">Acessório</option><option value="Saúde">Saúde</option></select></div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="submit" className="btn btn-lg rounded-2 fw-bold" style={{ backgroundColor: tema, color: 'white' }} disabled={!nome || !preco || !tipo}><i className="bi bi-save me-2"></i>Cadastrar Produto</button>
                    </div>
                </form>
            </div>
        </div>
    );
}