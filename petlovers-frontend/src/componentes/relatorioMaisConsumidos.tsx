import React from 'react';

type ItemConsumo = {
    nome: string;
    quantidade: number;
    valor: number;
};

type Props = {
    tema: string;
    dados: {
        produtos: ItemConsumo[];
        servicos: ItemConsumo[];
    }
}

export default function RelatorioMaisConsumidos(props: Props) {
    const { tema, dados } = props;
    if (!dados) return <div>Carregando...</div>;

    const ListaRanking = ({ titulo, icone, dados, corBadge }: any) => (
        <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light"><h6 className="mb-0"><i className={`bi ${icone} me-2`}></i>{titulo}</h6></div>
                <div className="card-body p-0">
                    {dados && dados.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {dados.map((item: ItemConsumo, index: number) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold">{item.nome}</span>
                                        <div className="text-success small">R$ {item.valor.toFixed(2)}</div>
                                    </div>
                                    <span className={`badge ${corBadge} rounded-pill`}>{item.quantidade} un</span>
                                </li>
                            ))}
                        </ul>
                    ) : (<div className="text-center py-4 text-muted"><i className="bi bi-cart-x" style={{ fontSize: '1.5rem' }}></i><p className="mt-2 mb-0">Nenhum item consumido</p></div>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold"><i className="bi bi-trophy me-2"></i>Produtos e Serviços Mais Consumidos</h5>
            </div>
            <div className="card-body">
                <div className="row g-4">
                    <ListaRanking titulo="Produtos Mais Consumidos" icone="bi-cart3" dados={dados.produtos} corBadge="bg-primary" />
                    <ListaRanking titulo="Serviços Mais Consumidos" icone="bi-wrench" dados={dados.servicos} corBadge="bg-info text-dark" />
                </div>
            </div>
        </div>
    );
}