# API de Loja Virtual
É exatamente o que parece, uma API RESTful de uma loja virtual. A princípio essa API permite fazer um CRUD completo de produtos, criar/alterar contas de usuário e filtrar os produtos com alguns critérios. Além disso possui um script para executar testes automatizados.

## Tecnologias
Nessa API foram utilizadas algumas tecnologias, sendo elas:
- Node.js como tecnologia principal;
- TypeScript pra deixar o desenvolvimento mais gostosinho e com menos erros;
- TypeORM para cuidar da parte relacionada a banco de dados e afins;
- Jest para realizar testes unitários e de integração de forma automatizada;
- SQLite como banco de dados pra teste... e é o principal também, mas aí é fácil de mudar depois;
- JWT para auxiliar na parte de autorização das rotas;

## Recursos
Por ser uma API RESTful, é possível realizar as operações por meio das rotas e dos verbos HTTP. No momento essa API é capaz de:

### Produtos
- Criar uma categoria de produtos nova*;
- Listar todas as categorias;
- Criar um produto novo, sendo possível enviar uma imagem para a rota*;
- Buscar um produto pelo ID;
- Listar todos os produtos, sendo possível passar alguns parâmetros pela query da rota a fim de filtrar, como um nome, preço mínimo etc;
- Atualizar um produto, sendo possível atualizar a imagem dele*;
- Deletar um produto*;

### Usuários
- Criar um usuário;
- Alterar um usuário**;
- Buscar usuário pelo ID**;
- Criar um administrador*;
- Logar como usuário ou admin; 

###### \* Necessita passar um JWT com autorização de admin.
###### \** Necessita passar um JWT com o mesmo ID da requisição.

## Configuração
Para executar essa API numa máquina local basta baixar ou clonar esse repositório e instalar as dependências com o o comando `npm install`. Após ter instalado é só executar o comando `npm run dev` para iniciar a API, mas antes é necessário criar um arquivo `.env` na raiz do projeto, seguindo o modelo do arquivo `.env.example`. Essas variáveis serão usadas para criar o primeiro admin do sistema. Sem um admin não é possível utilizar vários recursos da API, incluindo criar outros admins.

## Armazenamento
No momento existem 3 conexões de banco de dados, cada um pra um banco diferente. Um é exclusivo para os testes automatizados, outro é exclusivo pra auxiliar no desenvolvimento e 
o último é o que será usado em produção. Por uma questão de praticidade os 3 bancos são SQLite no momento, mas é relativamente tranquilo de alterar o banco que será usado em produção (obrigado TypeORM 💕).
<br><br>

As imagens referentes aos produtos são armazenadas numa pasta dedicada ao upload dessas imagens, que será pública, podendo facilmente (eu espero) ser buscadas pela aplicação front-end que irá consumir a API.

## Testes
Este projeto tá configurado pra executar testes unitários e de integração de forma automática por meio do Jest. Para executar esses testes basta rodar o comando `npm test`. Esses testes utilizam uma base de dados separada, dedicada exclusivamente aos testes. Eles também testam o tratamento do upload de imagens por parte da API e, se funcionarem corretamente, excluem as imagens usadas nos testes da pasta de uploads. 

## Client
No momento ainda não há uma aplicação client pra consumir essa API, só o bom e velho Insomnia. Mas logo logo vou desenvolver alguma coisa pra deixar completinho. É isso.
