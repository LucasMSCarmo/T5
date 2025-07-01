import React, { useState } from 'react';
import { Produto, UpdateProduto } from "./dados";

type Props = {
    tema: string;
    produto: Produto;
    onSalvar: (produto: UpdateProduto) => void;
    onCancelar: () => void;
}

export default function FormularioEdicaoProduto(props: Props) {
    const { tema, produto, onSalvar, onCancelar } = props;

    // Lógica de estado da versão nova
    const [preco, setPreco] = useState(produto.preco.toString());
    const [tipo, setTipo] = useState(produto.tipo);

    // Lógica de submissão corrigida da versão nova
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const produtoAtualizado: UpdateProduto = {
            id: produto.id!,
            nome: produto.nome, // Nome não é editável
            preco: parseFloat(preco),
            tipo: tipo
        };
        onSalvar(produtoAtualizado);
    }

    // JSX com estilização da versão antiga
    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                        <h5 className="modal-title fw-bold mb-0"><i className="bi bi-pencil-square me-2"></i>Editando Produto: {produto.nome}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onCancelar}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="mb-4"><label className="form-label small fw-semibold"><i className="bi bi-currency-dollar me-2" style={{ color: tema }}></i>Preço (R$)*</label><input type="number" step="0.01" className="form-control rounded-2" value={preco} onChange={(e) => setPreco(e.target.value)} required /></div>
                            <div className="mb-3"><label className="form-label small fw-semibold"><i className="bi bi-tags me-2" style={{ color: tema }}></i>Tipo de Produto*</label><select className="form-select rounded-2" value={tipo} onChange={(e) => setTipo(e.target.value)} required><option value="Alimento">Alimento</option><option value="Higiene">Higiene</option><option value="Brinquedo">Brinquedo</option><option value="Acessório">Acessório</option><option value="Saúde">Saúde</option></select></div>
                        </div>
                        <div className="modal-footer border-top-0 px-4 pb-4 pt-0">
                            <button type="button" className="btn btn-outline-secondary rounded-2 px-4" onClick={onCancelar}><i className="bi bi-x-lg me-2"></i>Cancelar</button>
                            <button type="submit" className="btn rounded-2 px-4 fw-semibold" style={{ backgroundColor: tema, color: 'white' }}><i className="bi bi-check-lg me-2"></i>Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}