const publicacoes = require('./Modulos/Publicacoes');
const conferencias = require('./Modulos/Conferencias');
const indice = require('./Modulos/Indice');
const parseData = require('./Modulos/ParseData');

if(false) {
    // TODO: prevent this in browser mode!
    const parseDataFS = require('./ModulosHelper/ParseDataFS');
}

module.exports = {
    publicacoes: publicacoes.AvaliacaoPublicacao,
    conferencias: conferencias.AvaliacaoConferencia,
    indice: indice.CalculoIndice
} 
