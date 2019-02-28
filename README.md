# Avaliação Qualis

Um pacote npm para avaliação de publicações e conferências.

Ao final, será gerado um arquivo json com as publicações em determinado intervalo e seus respectivos conceitos.

### Install on npm

`npm install avaliacao-qualis`

## How to use it

```js
var avaliacaoQualis = require('avaliacao-qualis');

avaliacaoQualis({
    classificacoesPublicadas: "./classificacoes.xls", // arquivo xls com as publicações no Qualis
    curriculoLattes: "./curriculo.xml",
    anoInicial: 2015,
    anoFinal: 2019
}, 

function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
```
