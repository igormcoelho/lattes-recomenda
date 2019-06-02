const publicacoes = require('./Modulos/Publicacoes');
const conferencias = require('./Modulos/Conferencias');
const indice = require('./Modulos/Indice');


module.exports = {
    publicacoes: publicacoes.AvaliacaoPublicacao,
    conferencias: conferencias.AvaliacaoConferencia,
    indice: indice.CalculoIndice
} 
