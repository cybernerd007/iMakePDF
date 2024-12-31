# iMakePDF - Manipulador de PDFs em Node.js

**iMakePDF** é uma aplicação web simples construída com Node.js e Express que permite visualizar, dividir e mesclar arquivos PDF diretamente no navegador. 

## Funcionalidades
- **Visualização de PDF**: Carregue e visualize um arquivo PDF diretamente no navegador.
- **Dividir PDF**: Separe cada página de um PDF em arquivos individuais.
- **Mesclar PDFs**: Mescle um novo PDF com o PDF atualmente carregado na visualização.

## Requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn

## Instalação
1. Clone este repositório:
```bash
  git clone https://github.com/cybernerd007/iMakePDF.git
```

2. Acesse o diretório do projeto:
```bash
  cd iMakePDF
```

3. Instale as dependências:
```bash
  npm install
```

## Execução
Para rodar a aplicação, utilize o seguinte comando:
```bash
  node app.js
```
A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto
```
.
├── app.js                   # Arquivo principal do servidor Node.js
├── package.json             # Configurações do projeto e dependências
├── uploads/                 # Diretório temporário para uploads de PDFs
├── output/                  # Diretório para PDFs divididos e mesclados
└── public/                  # Arquivos estáticos (HTML, CSS, JS)
    └── index.html           # Front-end da aplicação
```

## Rotas da API
### Visualizar PDF
```
POST /preview
```
- **Descrição**: Carrega e exibe um PDF no navegador.
- **Parâmetros**: Arquivo PDF (via multipart/form-data)
- **Resposta**:
```json
{
  "url": "/preview.pdf"
}
```

### Dividir PDF
```
POST /split
```
- **Descrição**: Divide o PDF carregado em páginas individuais.
- **Resposta**:
```json
{
  "message": "PDF dividido com sucesso!"
}
```

### Mesclar PDFs
```
POST /merge
```
- **Descrição**: Mescla um novo PDF com o PDF atual.
- **Parâmetros**: Arquivo PDF (via multipart/form-data)
- **Resposta**:
```json
{
  "message": "PDFs mesclados com sucesso!"
}
```

## Customização
Você pode modificar o estilo e a interface do usuário editando o arquivo `public/index.html`.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença
Este projeto é licenciado sob a Licença MIT. Sinta-se livre para usá-lo e modificá-lo conforme necessário.

---
**Autor**: [Matrix_s0beit](https://github.com/cybernerd007)
