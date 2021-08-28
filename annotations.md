*********************************************************************************************
## Configurações

#### ormconfig.json
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
##### Necessário instalar ts-node||ts-node-dev caso use arquivos .ts (pra não ter erro é bom sempre instalar)
##### Neste caso instalei o ts-node-dev e o typeorm localmente, então precisei usá-los dentro do node_modules
---------------------------------------------------------------------------------------------   

*********************************************************************************************
## Informações

#### Relacionamento
    Eager busca dados da outra tabela (FK) nos selects; Cascade também salva dados na tabela FK (no caso, o que tiver na classArray da instância) 
```ts
    // necessário ter uma instância (prop) na outra classe
    @OneToMany(() => Class, classObject => classObject.prop, { eager: true, cascade: true })
    classArray: Class[];
    // apenas uma classe da relação pode ter eager se não dá recursão infinita
```