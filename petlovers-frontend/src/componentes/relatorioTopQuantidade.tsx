import React from 'react';

type TopClienteInfo = {
    nomeCliente: string;
    valorProdutos: number;
    qtdProdutos: number;
    valorServicos: number;
    qtdServicos: number;
    valorGeral: number;
    qtdGeral: number;
};

type Props = {
    tema: string;
    dados: {
        topProdutos: TopClienteInfo[];
        topServicos: TopClienteInfo[];
        topGeral: TopClienteInfo[];
    };
}

export default function RelatorioTopQuantidade(props: Props) {
    const { tema, dados } = props;
    if (!dados) return <div>Carregando...</div>;

    const TabelaRanking = ({ titulo, icone, dados, metricaValor, metricaQtd, corBadge }: any) => (
        <div className="col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light"><h6 className="mb-0"><i className={`bi ${icone} me-2`}></i>{titulo}</h6></div>
                <div className="card-body p-0">
                    {dados.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {dados.map((item: any, index: number) => (
                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center py-2">
                                    <div>
                                        <span className="fw-bold">{index + 1}. {item.nomeCliente}</span>
                                        <div className="text-muted small">Valor: R$ {item[metricaValor].toFixed(2).replace('.', ',')}</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className={`badge bg-${corBadge} rounded-pill me-2`}>{item[metricaQtd]} itens</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<div className="text-center py-4 text-muted"><i className="bi bi-emoji-frown" style={{ fontSize: '1.5rem' }}></i><p className="mt-2 mb-0">Nenhum consumo</p></div>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold"><i className="bi bi-cart-check-fill me-2"></i>Top 5 Clientes por Quantidade de Itens</h5>
            </div>
            <div className="card-body">
                <div className="row g-4">
                    <TabelaRanking titulo="Top Produtos" icone="bi-box-seam" dados={dados.topProdutos} metricaValor="valorProdutos" metricaQtd="qtdProdutos" corBadge="primary" />
                    <TabelaRanking titulo="Top Serviços" icone="bi-tools" dados={dados.topServicos} metricaValor="valorServicos" metricaQtd="qtdServicos" corBadge="info text-dark" />
                    <TabelaRanking titulo="Top Geral" icone="bi-trophy-fill" dados={dados.topGeral} metricaValor="valorGeral" metricaQtd="qtdGeral" corBadge="success" />
                </div>
            </div>
        </div>
    );
}