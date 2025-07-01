import React, { useMemo } from 'react'; // 1. Importamos o React e o Hook "useMemo"
import { Produto, Servico } from "./dados";

type Props = {
    tema: string;
    produtos: Produto[];
    servicos: Servico[];
    onEditarProduto: (produto: Produto) => void;
    onExcluirProduto: (produto: Produto) => void;
    onEditarServico: (servico: Servico) => void;
    onExcluirServico: (servico: Servico) => void;
}

export default function Catalogo(props: Props) {
    const { tema, produtos, servicos, onEditarProduto, onExcluirProduto, onEditarServico, onExcluirServico } = props;

    const groupByType = (items: Array<Produto | Servico>) => {
        return items.reduce((acc: { [key: string]: any[] }, item) => {
            if (!acc[item.tipo]) {
                acc[item.tipo] = [];
            }
            acc[item.tipo].push(item);
            return acc;
        }, {});
    }
    
    const produtosPorTipo = useMemo(() => groupByType(produtos), [produtos]);
    const servicosPorTipo = useMemo(() => groupByType(servicos), [servicos]);

    const tiposDeProdutosOrdenados = useMemo(() => Object.keys(produtosPorTipo).sort((a, b) => a.localeCompare(b)), [produtosPorTipo]);
    const tiposDeServicosOrdenados = useMemo(() => Object.keys(servicosPorTipo).sort((a, b) => a.localeCompare(b)), [servicosPorTipo]);

    return (
        <div className="container-fluid p-3">
            <section className="mb-5">
                <h4 className="mb-3 border-bottom pb-2" style={{ color: tema }}>
                    <i className="bi bi-box-seam me-2"></i>
                    Produtos
                </h4>

                {tiposDeProdutosOrdenados.length > 0 ? (
                    tiposDeProdutosOrdenados.map(tipo => {
                        const itens = produtosPorTipo[tipo];
                        itens.sort((a, b) => a.nome.localeCompare(b.nome));

                        return (
                            <div key={`prod-type-${tipo}`} className="mb-4">
                                <h5 className="text-muted mb-3">{tipo}</h5>
                                <div className="list-group">
                                    {itens.map((produto, index) => (
                                        <div key={`prod-${index}`} className="list-group-item border-0 py-2 px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{produto.nome}</strong>
                                                    <div className="text-success">R$ {produto.preco.toFixed(2).replace('.', ',')}</div>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-link text-primary"
                                                        title="Editar"
                                                        onClick={() => onEditarProduto(produto as Produto)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-link text-danger"
                                                        title="Excluir"
                                                        onClick={() => onExcluirProduto(produto as Produto)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-muted py-3">
                        <i className="bi bi-box-open me-2"></i>
                        Nenhum produto cadastrado
                    </div>
                )}
            </section>

            <section>
                <h4 className="mb-3 border-bottom pb-2" style={{ color: tema }}>
                    <i className="bi bi-tools me-2"></i>
                    Serviços
                </h4>

                {tiposDeServicosOrdenados.length > 0 ? (
                    tiposDeServicosOrdenados.map(tipo => {
                        const itens = servicosPorTipo[tipo];
                        itens.sort((a, b) => a.nome.localeCompare(b.nome));

                        return (
                            <div key={`serv-type-${tipo}`} className="mb-4">
                                <h5 className="text-muted mb-3">{tipo}</h5>
                                <div className="list-group">
                                    {itens.map((servico, index) => (
                                        <div key={`serv-${index}`} className="list-group-item border-0 py-2 px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{servico.nome}</strong>
                                                    <div className="text-success">R$ {servico.preco.toFixed(2).replace('.', ',')}</div>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-link text-primary"
                                                        title="Editar"
                                                        onClick={() => onEditarServico(servico as Servico)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-link text-danger"
                                                        title="Excluir"
                                                        onClick={() => onExcluirServico(servico as Servico)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-muted py-3">
                        <i className="bi bi-tools me-2"></i>
                        Nenhum serviço cadastrado
                    </div>
                )}
            </section>
        </div>
    );
}