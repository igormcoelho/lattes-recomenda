# Avaliação Qualis

Um pacote npm para avaliação de publicações e conferências do currículo Lattes.

### Install on npm

`npm install avaliacao-qualis`

## Avaliação de publicações

Informe o caminho onde está localizado o currículo Lattes para obter a lista de publicações no intervalo determinado com seus respectivos conceitos (Qualis). 

É necessário informar também o arquivo xls contendo os periódicos Qualis da área de avaliação e o intervalo de anos a ser consultado.


```js
const avaliacaoQualis = require('avaliacao-qualis');

avaliacaoQualis.publicacoes({

        classificacoesPublicadas: './caminho/para/classificacoes_publicadas.xls',
        curriculoLattes: './caminho/para/curriculo.xml',
        anoInicial: 2015,
        anoFinal: 2018
    }, 

    function(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    }
);
```

## Avaliação de Conferências

Para a avaliação de conferências, informe o caminho onde está localizado o currículo Lattes, o intervalo em anos e o grau de similaridade para a comparação das conferências do currículo Lattes com as conferências Qualis.

Obs: Avaliação disponível apenas para as conferências da área de Ciência da Computação - Qualis 2016.

```js
const avaliacaoQualis = require('avaliacao-qualis');

avaliacaoQualis.conferencias({

        curriculoLattes: './caminho/para/curriculo.xml',
        anoInicial: 2010,
        anoFinal: 2019,
        similaridade: 0.7 // entre 0.1 e 1
    },

    function(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    }
);
```

## Cálculo do índice do PPG-CCOMP

Para obter o índice do PPG-CCOMP, informe o caminho onde está localizado o currículo Lattes.

```js
const avaliacaoQualis = require('avaliacao-qualis');

    avaliacaoQualis.indice({
        curriculoLattes: './caminho/para/curriculo.xml',
        similaridade: 0.7 // entre 0.1 e 1
    },

    function(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    }
);
```