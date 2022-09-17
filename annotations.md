# Macetes e truques de algumas tecnologias
*********************************************************************************************
## TypeORM

#### Exemplo do arquivo ormconfig.json que vai na raiz do projeto
```json
    {
      "type": "sqlite",
      "database": "./src/database/database.sqlite",
      "entities": [
        "./src/models/**/*.ts"
      ],
      "migrations": [
        "./src/database/migrations/**/*.ts"
      ],
      "cli": {
        "entitiesDir": "./src/models",
        "migrationsDir": "./src/database/migrations"
      }
    }
```
---------------------------------------------------------------------------------------------    

#### Script pra rodar o cli do typeorm caso não esteja global (após isso basta usar npm run typeorm + comando)
```json
    scripts: {
      "typeorm": "node --require ./node_modules/ts-node-dev/node_modules/ts-node/register ./node_modules/typeorm/cli.js"
    }
```
#### Necessário instalar ts-node||ts-node-dev caso use arquivos .ts (pra não ter erro é bom sempre instalar)
#### Neste caso instalei o ts-node-dev e o typeorm localmente, então precisei usá-los dentro do node_modules  
---------------------------------------------------------------------------------------------  

#### Exemplo de relacionamento na model
*Eager busca dados da outra tabela (FK) nos selects; Cascade também salva dados na tabela FK (no caso, o que tiver na classArray da instância) 
```ts
    // necessário ter uma instância (prop) na outra classe
    @OneToMany(() => Class, classObject => classObject.prop, { eager: true, cascade: true })
    classArray: Class[];
    // apenas uma classe da relação pode ter eager se não dá recursão infinita
```
*********************************************************************************************
*********************************************************************************************

## Docker

#### Criar uma imagem docker a partir de um Dockerfile
```shell
    docker build -t [SEU_NICK]/[NOME_DA_IMAGEM] .
```
---------------------------------------------------------------------------------------------  

#### Listar imagens criadas
```shell
    docker images
```
---------------------------------------------------------------------------------------------  

#### Criar um container a partir de uma imagem
```shell
    docker run -p [PORTA_DO_PC]:[PORTA_DO_CONTAINER] -d [SEU_NICK]/[NOME_DA_IMAGEM]
```
---------------------------------------------------------------------------------------------  

#### Listar containers
```shell
    docker ps
```
--------------------------------------------------------------------------------------------- 

#### Iniciar/Parar/Remover/Ver logs de um container
```shell
    docker start|stop|rm|logs [ID_DO_CONTAINER]
```
--------------------------------------------------------------------------------------------- 

#### Entrar em um container
```shell
    docker exec -it [ID_DO_CONTAINER] /bin/bash
```
--------------------------------------------------------------------------------------------- 