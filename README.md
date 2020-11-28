# REST API do aplicativo DevCounts

Esta API foi desenvolvida em `NodeJs`, e foi desenvolvida para a criação do APP **DevCounts**. 
Com intuito de aprendizado e de gerenciamento das minhas contas.

Os códigos fontes da **API** se encontram na pasta `/src`.

## Intalação

    npm install

ou

    yarn install


## Execitando a API

    npm dev

ou

    yarn dev


# API REST

Logo abaixo estão descritas as rotas da API.

## Rotas

* Authenticação
* Listagem de Usuários
* Cadastro de Usuários
* Listagem de Contas
* Cadastro de Contas
* Listagem de Contas


## Autenticação

### Solicitação

`POST /auth`
```yaml
{
    "email": "exemple@hotmail.com", 
    "password": "123456789"
}
```

##### Solicitação bem sucedida.

```yaml
{
    "user": {
        "id": "65das4dqwdqw84.qweoasd5412",
        "name": "Nomo do usuário",
        "email": "email@usuario.com",
    },
    "token": "JWToken"
}
```

##### Erro ao tentar se autenticar. (code: 401)

```yaml
{ 
    "error": "Unauthorized."
}
```
