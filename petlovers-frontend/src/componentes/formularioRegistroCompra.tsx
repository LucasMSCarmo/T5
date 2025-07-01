import React, { useState } from 'react';
import { Cliente, Pet, Produto, Servico } from "./dados";

type CompraPayload = {
    petId: number;
    produtos: { produtoId: number; quantidade: number; }[];
    servicos: { servicoId: number; }[];
}

type Props = {
    tema: string;
    clientes: Cliente[];
    produtos: Produto[];
    servicos: Servico[];
    onSubmit: (payload: CompraPayload) => void;
    onCancelar: () => void;
}

export default function FormularioRegistroCompra(props: Props) {
    const { tema, clientes, produtos, servicos, onSubmit, onCancelar } = props;

    const [clienteId, setClienteId] = useState<string>('');
    const [petId, setPetId] = useState<string>('');
    const [produtosConsumidos, setProdutosConsumidos] = useState<Map<number, number>>(new Map());
    const [servicosConsumidos, setServicosConsumidos] = useState<Set<number>>(new Set());

    const clienteSelecionado = clientes.find(c => c.id === Number(clienteId));

    const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClienteId(e.target.value);
        setPetId('');
    };
    const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPetId(e.target.value);
    };
    const handleProdutoChange = (produtoId: number, quantidade: number) => {
        const novosProdutos = new Map(produtosConsumidos);
        if (quantidade > 0) novosProdutos.set(produtoId, quantidade);
        else novosProdutos.delete(produtoId);
        setProdutosConsumidos(novosProdutos);
    };
    const handleServicoChange = (servicoId: number, isChecked: boolean) => {
        const novosServicos = new Set(servicosConsumidos);
        if (isChecked) novosServicos.add(servicoId);
        else novosServicos.delete(servicoId);
        setServicosConsumidos(novosServicos);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: CompraPayload = {
            petId: Number(petId),
            produtos: Array.from(produtosConsumidos.entries()).map(([produtoId, quantidade]) => ({ produtoId, quantidade })),
            servicos: Array.from(servicosConsumidos).map(servicoId => ({ servicoId })),
        };
        onSubmit(payload);
    };
    
    const isSubmitDisabled = !clienteId || !petId || (produtosConsumidos.size === 0 && servicosConsumidos.size === 0);

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold"><i className="bi bi-cart-plus me-2"></i>Registrar Consumo</h5>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-3"><i className="bi bi-person-check-fill me-2" style={{ color: tema }}></i>Seleção do Cliente e Pet</h6>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="form-label small fw-semibold">Cliente*</label><select className="form-select rounded-2" value={clienteId} onChange={handleClienteChange} required><option value="">Selecione um cliente...</option>{clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
                            <div className="col-md-6"><label className="form-label small fw-semibold">Pet*</label><select className="form-select rounded-2" value={petId} onChange={handlePetChange} disabled={!clienteSelecionado} required><option value="">Selecione um pet...</option>{clienteSelecionado?.pets.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.raca})</option>)}</select></div>
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h6 className="fw-bold text-muted mb-3"><i className="bi bi-basket2-fill me-2" style={{ color: tema }}></i>Produtos</h6>
                            <div className="table-responsive" style={{maxHeight: '300px'}}>
                                <table className="table table-sm table-hover mb-0"><tbody>
                                    {produtos.map(produto => (
                                        <tr key={produto.id}>
                                            <td className='py-2'>{produto.nome}<br/><small className="text-success">R$ {produto.preco.toFixed(2)}</small></td>
                                            <td className="text-end" style={{verticalAlign: 'middle'}}>
                                                <input type="number" min="0" className="form-control form-control-sm" style={{ width: '80px' }} onChange={(e) => handleProdutoChange(produto.id!, parseInt(e.target.value) || 0)} value={produtosConsumidos.get(produto.id!) || 0} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody></table>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6 className="fw-bold text-muted mb-3"><i className="bi bi-wrench-adjustable-circle-fill me-2" style={{ color: tema }}></i>Serviços</h6>
                            {/* Bloco de serviços com a nova estilização */}
                            <div className="d-flex flex-column" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                {servicos.map(servico => (
                                    <div key={servico.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                        <div>
                                            <span>{servico.nome}</span>
                                            <br/>
                                            <small className="text-success">R$ {servico.preco.toFixed(2)}</small>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                style={{ fontSize: '1.25rem' }}
                                                id={`servico-${servico.id}`}
                                                checked={servicosConsumidos.has(servico.id!)}
                                                onChange={(e) => handleServicoChange(servico.id!, e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <button type="button" className="btn btn-outline-secondary rounded-2" onClick={onCancelar}>Cancelar</button>
                        <button type="submit" className="btn rounded-2 fw-bold" style={{ backgroundColor: tema, color: 'white' }} disabled={isSubmitDisabled}>Registrar Compra</button>
                    </div>
                </form>
            </div>
        </div>
    );
}