# Avaliação Qualis

Um pacote npm para avaliação de publicações e conferências.

### Install on npm

`npm install avaliacao-qualis`

## Avaliação de publicações

Para a avaliação de publicações, ao final, será gerado um arquivo json com as publicações no intervalo escolhido e seus respectivos conceitos (Qualis).

```js
const avaliacaoQualis = require('avaliacao-qualis');

avaliacaoQualis.publicacoes({
    classificacoesPublicadas: './caminho/para/classificacoes_publicadas.xls',
    curriculoLattes: './caminho/para/curriculo.xml',
    anoInicial: 2015,
    anoFinal: 2018
}, 

function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
```

## Avaliação de Conferências

Para a avaliação de conferências, ao final, será gerado um arquivo em texto com as conferências e seus respectivos conceitos (Qualis) e um arquivo com as conferências não encontradas na base do Qualis.

```js
const avaliacaoQualis = require('avaliacao-qualis');

avaliacaoQualis.conferencias({
    arquivoLattes: './caminho/para/curriculo.xml',
    arquivoConferencias: './caminho/para/Qualis_conferencia.pdf'
},

function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
```
