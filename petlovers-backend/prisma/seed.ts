import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Defina tipos auxiliares para os dados de seed
type ProdutoConsumoSeed = {
  nomeProduto: string;
  quantidade: number;
};

type ServicoConsumoSeed = {
  nomeServico: string;
};

type PetSeed = {
  nome: string;
  tipo: string;
  raca: string;
  genero: string;
  produtosConsumidos: ProdutoConsumoSeed[];
  servicosConsumidos?: ServicoConsumoSeed[];
};

type ClienteSeed = {
  nome: string;
  nomeSocial: string;
  email: string;
  cpf: string;
  telefones: { numero: string }[];
  rgs: { numero: string; dataEmissao: Date }[];
  pets: PetSeed[];
};

// LISTA COMPLETA DE PRODUTOS
const produtosBase = [
    // Alimentos
    { nome: "Ração Premium Cachorro", preco: 120.00, tipo: "Alimento" },
    { nome: "Ração Premium Gato", preco: 110.00, tipo: "Alimento" },
    { nome: "Ração Filhotes", preco: 100.00, tipo: "Alimento" },
    { nome: "Alimento para Pássaros", preco: 35.90, tipo: "Alimento" },
    { nome: "Alimento para Peixes", preco: 25.50, tipo: "Alimento" },
    { nome: "Ração para Roedores", preco: 30.00, tipo: "Alimento" },
    { nome: "Feno", preco: 40.00, tipo: "Alimento" },
    { nome: "Alimento para Répteis", preco: 45.00, tipo: "Alimento" },
    { nome: "Ração para Furões", preco: 85.00, tipo: "Alimento" },

    // Acessórios
    { nome: "Coleira Couro", preco: 45.90, tipo: "Acessório" },
    { nome: "Gaiola para Pássaros", preco: 199.90, tipo: "Acessório" },
    { nome: "Aquário 30L", preco: 250.00, tipo: "Acessório" },
    { nome: "Casa para Hamster", preco: 89.90, tipo: "Acessório" },
    { nome: "Bebedouro Automático", preco: 65.00, tipo: "Acessório" },
    { nome: "Terrário Médio", preco: 320.00, tipo: "Acessório" },

    // Brinquedos
    { nome: "Brinquedo Osso", preco: 29.90, tipo: "Brinquedo" },
    { nome: "Arranhador para Gatos", preco: 159.90, tipo: "Brinquedo" },
    { nome: "Balanço para Pássaros", preco: 22.50, tipo: "Brinquedo" },
    { nome: "Roda para Hamster", preco: 45.00, tipo: "Brinquedo" },

    // Higiene
    { nome: "Shampoo Hidratante", preco: 42.80, tipo: "Higiene" },
    { nome: "Tapete Higiênico", preco: 39.90, tipo: "Higiene" },
    { nome: "Areia Sanitária", preco: 35.00, tipo: "Higiene" },
    { nome: "Lenço Umedecido", preco: 25.00, tipo: "Higiene" },

    // Saúde
    { nome: "Vermífugo", preco: 35.00, tipo: "Saúde" },
    { nome: "Anti-pulgas", preco: 55.90, tipo: "Saúde" },
    { nome: "Complexo Vitamínico", preco: 48.00, tipo: "Saúde" },
    { nome: "Probiótico", preco: 42.00, tipo: "Saúde" }
];

// LISTA COMPLETA DE SERVIÇOS
const servicosBase = [
    // Higiene
    { nome: "Banho e Tosa Completo", preco: 80.00, tipo: "Higiene" },
    { nome: "Banho Simples", preco: 50.00, tipo: "Higiene" },
    { nome: "Tosa Higiênica", preco: 45.00, tipo: "Higiene" },
    { nome: "Corte de Unhas", preco: 25.00, tipo: "Higiene" },
    { nome: "Limpeza de Orelhas", preco: 30.00, tipo: "Higiene" },
    { nome: "Hidratação", preco: 60.00, tipo: "Higiene" },

    // Saúde
    { nome: "Consulta Veterinária", preco: 150.00, tipo: "Saúde" },
    { nome: "Vacinação", preco: 90.00, tipo: "Saúde" },
    { nome: "Exame de Sangue", preco: 120.00, tipo: "Saúde" },
    { nome: "Ultrassom", preco: 250.00, tipo: "Saúde" },
    { nome: "Curativo", preco: 40.00, tipo: "Saúde" },

    // Outros
    { nome: "Hospedagem Diária", preco: 120.00, tipo: "Hotel" },
    { nome: "Adestramento Básico", preco: 200.00, tipo: "Treinamento" },
    { nome: "Transporte Pet", preco: 60.00, tipo: "Transporte" },
    { nome: "Taxi Dog", preco: 45.00, tipo: "Transporte" },
    { nome: "Day Care", preco: 85.00, tipo: "Hotel" }
];

const clientesData = [
    {
        nome: "João Silva",
        nomeSocial: "João",
        email: "joao.silva@email.com",
        cpf: "111.222.333-44",
        telefones: [{ numero: "(11) 9999-8888" }],
        rgs: [{ numero: "12.345.678-9", dataEmissao: new Date("2010-05-20") }],
        pets: [
            { nome: "Rex", tipo: "Cachorro", raca: "Labrador", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Ração Premium Cachorro", quantidade: 2 }], servicosConsumidos: [{ nomeServico: "Banho e Tosa Completo" }] },
            { nome: "Mimi", tipo: "Gato", raca: "Siamês", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Ração Premium Gato", quantidade: 1 }], servicosConsumidos: [{ nomeServico: "Consulta Veterinária" }] }
        ]
    },
    {
        nome: "Maria Souza",
        nomeSocial: "Maria",
        email: "maria.souza@email.com",
        cpf: "222.333.444-55",
        telefones: [{ numero: "(21) 8888-7777" }],
        rgs: [{ numero: "23.456.789-0", dataEmissao: new Date("2012-08-15") }],
        pets: [
            { nome: "Thor", tipo: "Cachorro", raca: "Bulldog", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Brinquedo Osso", quantidade: 3 }], servicosConsumidos: [{ nomeServico: "Vacinação" }, { nomeServico: "Banho Simples" }] }
        ]
    },
    {
        nome: "Carlos Oliveira",
        email: "carlos.oliveira@email.com",
        cpf: "333.444.555-66",
        telefones: [{ numero: "(31) 7777-6666" }],
        rgs: [{ numero: "34.567.890-1", dataEmissao: new Date("2015-03-10") }],
        pets: [
            { nome: "Piu", tipo: "Pássaro", raca: "Calopsita", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Pássaros", quantidade: 1 }], servicosConsumidos: [{ nomeServico: "Consulta Veterinária" }] }
        ]
    },
    {
        nome: "Ana Santos",
        email: "ana.santos@email.com",
        cpf: "444.555.666-77",
        telefones: [{ numero: "(41) 6666-5555" }],
        rgs: [{ numero: "45.678.901-2", dataEmissao: new Date("2018-07-22") }],
        pets: [
            { nome: "Nemo", tipo: "Peixe", raca: "Palhaço", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Peixes", quantidade: 2 }] },
            { nome: "Dory", tipo: "Peixe", raca: "Cirurgião-patela", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Alimento para Peixes", quantidade: 2 }] }
        ]
    },
    {
        nome: "Pedro Costa",
        email: "pedro.costa@email.com",
        cpf: "555.666.777-88",
        telefones: [{ numero: "(51) 5555-4444" }],
        rgs: [{ numero: "56.789.012-3", dataEmissao: new Date("2019-11-05") }],
        pets: [
            { nome: "Fluffy", tipo: "Coelho", raca: "Angorá", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Feno", quantidade: 5 }], servicosConsumidos: [{ nomeServico: "Consulta Veterinária" }] }
        ]
    },
    {
        nome: "Juliana Pereira",
        email: "juliana.pereira@email.com",
        cpf: "666.777.888-99",
        telefones: [{ numero: "(61) 4444-3333" }],
        rgs: [{ numero: "67.890.123-4", dataEmissao: new Date("2020-01-15") }],
        pets: [
            { nome: "Speedy", tipo: "Hamster", raca: "Sírio", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Ração para Roedores", quantidade: 1 }] }
        ]
    },
    {
        nome: "Marcos Ribeiro",
        email: "marcos.ribeiro@email.com",
        cpf: "777.888.999-00",
        telefones: [{ numero: "(71) 3333-2222" }],
        rgs: [{ numero: "78.901.234-5", dataEmissao: new Date("2017-09-30") }],
        pets: [
            { nome: "Ziggy", tipo: "Réptil", raca: "Iguana", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Répteis", quantidade: 1 }] }
        ]
    },
    {
        nome: "Fernanda Alves",
        email: "fernanda.alves@email.com",
        cpf: "888.999.000-11",
        telefones: [{ numero: "(81) 2222-1111" }],
        rgs: [{ numero: "89.012.345-6", dataEmissao: new Date("2016-04-18") }],
        pets: [
            { nome: "Bolinha", tipo: "Porquinho-da-índia", raca: "Americano", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Ração para Roedores", quantidade: 2 }] }
        ]
    },
    {
        nome: "Ricardo Nunes",
        email: "ricardo.nunes@email.com",
        cpf: "999.000.111-22",
        telefones: [{ numero: "(91) 1111-0000" }],
        rgs: [{ numero: "90.123.456-7", dataEmissao: new Date("2014-12-25") }],
        pets: [
            { nome: "Shelly", tipo: "Tartaruga", raca: "Tigre d'Água", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Alimento para Répteis", quantidade: 1 }] }
        ]
    },
    {
        nome: "Patrícia Lima",
        email: "patricia.lima@email.com",
        cpf: "123.456.789-00",
        telefones: [{ numero: "(19) 9876-5432" }],
        rgs: [{ numero: "12.345.678-X", dataEmissao: new Date("2013-06-14") }],
        pets: [
            { nome: "Twitty", tipo: "Pássaro", raca: "Canário", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Pássaros", quantidade: 1 }] }
        ]
    },
    {
        nome: "Roberto Santos",
        email: "roberto.santos@email.com",
        cpf: "987.654.321-00",
        telefones: [{ numero: "(21) 1234-5678" }],
        rgs: [{ numero: "98.765.432-1", dataEmissao: new Date("2011-10-30") }],
        pets: [
            { nome: "Goldie", tipo: "Peixe", raca: "Dourado", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Alimento para Peixes", quantidade: 1 }] },
            { nome: "Silver", tipo: "Peixe", raca: "Tetra Néon", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Peixes", quantidade: 1 }] }
        ]
    },
    {
        nome: "Amanda Costa",
        email: "amanda.costa@email.com",
        cpf: "456.789.123-00",
        telefones: [{ numero: "(31) 2345-6789" }],
        rgs: [{ numero: "45.678.912-3", dataEmissao: new Date("2019-02-18") }],
        pets: [
            { nome: "Bugs", tipo: "Coelho", raca: "Holandês", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Feno", quantidade: 3 }] }
        ]
    },
    {
        nome: "Felipe Rocha",
        email: "felipe.rocha@email.com",
        cpf: "654.321.987-00",
        telefones: [{ numero: "(41) 3456-7890" }],
        rgs: [{ numero: "65.432.198-7", dataEmissao: new Date("2017-07-07") }],
        pets: [
            { nome: "Spike", tipo: "Porco-espinho", raca: "Africano", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Ração para Roedores", quantidade: 1 }] }
        ]
    },
    {
        nome: "Camila Dias",
        email: "camila.dias@email.com",
        cpf: "321.654.987-00",
        telefones: [{ numero: "(51) 4567-8901" }],
        rgs: [{ numero: "32.165.498-7", dataEmissao: new Date("2016-11-11") }],
        pets: [
            { nome: "Luna", tipo: "Furão", raca: "Ferreto", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Ração para Furões", quantidade: 1 }] }
        ]
    },
    {
        nome: "Gustavo Henrique",
        email: "gustavo.henrique@email.com",
        cpf: "789.123.456-00",
        telefones: [{ numero: "(61) 5678-9012" }],
        rgs: [{ numero: "78.912.345-6", dataEmissao: new Date("2015-04-22") }],
        pets: [
            { nome: "Rango", tipo: "Lagarto", raca: "Dragão Barbudo", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Répteis", quantidade: 1 }] }
        ]
    },
    {
        nome: "Isabela Martins",
        email: "isabela.martins@email.com",
        cpf: "147.258.369-00",
        telefones: [{ numero: "(71) 6789-0123" }],
        rgs: [{ numero: "14.725.836-9", dataEmissao: new Date("2014-09-03") }],
        pets: [
            { nome: "Pancake", tipo: "Tartaruga", raca: "Cágado", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Alimento para Répteis", quantidade: 1 }] }
        ]
    },
    {
        nome: "Lucas Barbosa",
        email: "lucas.barbosa@email.com",
        cpf: "258.369.147-00",
        telefones: [{ numero: "(81) 7890-1234" }],
        rgs: [{ numero: "25.836.914-7", dataEmissao: new Date("2013-12-12") }],
        pets: [
            { nome: "Chirp", tipo: "Pássaro", raca: "Periquito", genero: "Macho", produtosConsumidos: [{ nomeProduto: "Alimento para Pássaros", quantidade: 1 }] }
        ]
    },
    {
        nome: "Tatiane Souza",
        email: "tatiane.souza@email.com",
        cpf: "369.147.258-00",
        telefones: [{ numero: "(91) 8901-2345" }],
        rgs: [{ numero: "36.914.725-8", dataEmissao: new Date("2012-05-17") }],
        pets: [
            { nome: "Whiskers", tipo: "Chinchila", raca: "Chinchila", genero: "Fêmea", produtosConsumidos: [{ nomeProduto: "Ração para Roedores", quantidade: 1 }] }
        ]
    }
];

async function main() {
  console.log(`Iniciando o processo de seed...`);

  console.log('Limpando dados antigos...');
  await prisma.servicoConsumido.deleteMany();
  await prisma.produtoConsumido.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.rG.deleteMany();
  await prisma.telefone.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.servico.deleteMany();
  console.log('Dados antigos limpos.');

  console.log('Criando produtos e serviços...');
  await prisma.produto.createMany({ data: produtosBase });
  await prisma.servico.createMany({ data: servicosBase });
  console.log('Produtos e serviços criados.');

  const produtos = await prisma.produto.findMany();
  const servicos = await prisma.servico.findMany();

  const produtoMap = new Map(produtos.map((p) => [p.nome, p.id]));
  const servicoMap = new Map(servicos.map((s) => [s.nome, s.id]));

  console.log('Criando clientes e pets...');
  for (const clienteData of clientesData) {
    try {
      await prisma.cliente.create({
        data: {
          nome: clienteData.nome,
          nomeSocial: clienteData.nomeSocial || clienteData.nome, // Fallback to nome if nomeSocial is missing
          email: clienteData.email,
          cpf: clienteData.cpf,
          rgs: {
            create: clienteData.rgs
          },
          telefones: {
            create: clienteData.telefones
          },
          pets: {
            create: await Promise.all(clienteData.pets.map(async (pet) => {
              // Verify all products exist
              for (const pc of pet.produtosConsumidos) {
                if (!produtoMap.has(pc.nomeProduto)) {
                  throw new Error(`Produto não encontrado: ${pc.nomeProduto} para o pet ${pet.nome}`);
                }
              }

              // Verify all services exist if they're provided
              if ('servicosConsumidos' in pet && Array.isArray(pet.servicosConsumidos) && pet.servicosConsumidos.length) {
                for (const sc of pet.servicosConsumidos) {
                  if (!servicoMap.has(sc.nomeServico)) {
                    throw new Error(`Serviço não encontrado: ${sc.nomeServico} para o pet ${pet.nome}`);
                  }
                }
              }

              return {
                nome: pet.nome,
                tipo: pet.tipo,
                raca: pet.raca,
                genero: pet.genero,
                produtosConsumidos: {
                  create: pet.produtosConsumidos.map((pc) => ({
                    quantidade: pc.quantidade,
                    produto: {
                      connect: { id: produtoMap.get(pc.nomeProduto)! }
                    }
                  }))
                },
                servicosConsumidos: Array.isArray((pet as any).servicosConsumidos) && (pet as any).servicosConsumidos.length ? {
                  create: (pet as any).servicosConsumidos.map((sc: ServicoConsumoSeed) => ({
                    servico: {
                      connect: { id: servicoMap.get(sc.nomeServico)! }
                    }
                  }))
                } : undefined
              };
            }))
          }
        }
      });
    } catch (error) {
      console.error(`Erro ao criar cliente ${clienteData.nome}:`, error);
      throw error; // Stop execution on error
    }
  }
  console.log('Seed finalizado com sucesso.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });