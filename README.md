# Avaliação Qualis

Um pacote npm para avaliação de publicações e conferências do currículo Lattes.

### Install on npm

`npm install avaliacao-qualis`

## Avaliação de publicações

Para obter a avaliação de publicações será gerado ao final da execução um arquivo json contendo as publicações no intervalo determinado com seus respectivos conceitos (Qualis).

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

Para obter a avaliação de conferências será gerado ao final da execução um arquivo em texto contendo as conferências e seus respectivos conceitos (Qualis) e um arquivo com as conferências não encontradas na base do Qualis.
Obs: Avaliação disponível apenas para as conferências da área de Ciência da Computação - Qualis 2016

```js
const avaliacaoQualis = require('avaliacao-qualis');

avaliacaoQualis.conferencias({
    arquivoLattes: './caminho/para/curriculo.xml'
},

function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
```
