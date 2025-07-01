import React from 'react';
import { Cliente } from "./dados";

type Props = {
    tema: string;
    clientes: Cliente[];
    onDetalhes: (cliente: Cliente) => void;
    onEditar: (cliente: Cliente) => void;
    onExcluir: (cliente: Cliente) => void;
}

export default function ListaCliente(props: Props) {
    const { tema, clientes, onDetalhes, onEditar, onExcluir } = props;

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                        <i className="bi bi-people-fill me-2"></i>
                        Clientes
                    </h5>
                    <span className="badge bg-light text-dark">{clientes.length} cliente(s)</span>
                </div>
            </div>

            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Nome</th>
                                <th>Nome Social</th>
                                <th>Email</th>
                                <th className="text-center">Pets</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id} className="align-middle">
                                    <td className="ps-4 fw-semibold">{cliente.nome}</td>
                                    <td className="text-muted">{cliente.nomeSocial || 'N/A'}</td>
                                    <td className="text-muted">{cliente.email}</td>
                                    <td className="text-center">
                                        <span className="badge rounded-pill" style={{ backgroundColor: tema, color: 'white', fontSize: '0.85rem' }}>
                                            {cliente.pets.length}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-end">
                                        <div className="btn-group btn-group-sm" role="group">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => onDetalhes(cliente)}
                                                title="Ver Detalhes"
                                            >
                                                <i className="bi bi-eye-fill"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-warning"
                                                onClick={() => onEditar(cliente)}
                                                title="Editar Cliente"
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => onExcluir(cliente)}
                                                title="Excluir Cliente"
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {clientes.length === 0 && (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-person-x" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2 mb-0">Nenhum cliente cadastrado.</p>
                        <small>Use o menu "Cadastros" para adicionar um novo cliente.</small>
                    </div>
                )}
            </div>
        </div>
    );
}