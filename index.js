var fs = require('fs');

exports = module.exports = AvaliacaoQualis;

function AvaliacaoQualis(config, callback) {
    if(!config.ClassificacoesPublicadas) {
        callback(new Error("Você não informou o arquivo xls de entrada."), null);
    } else if(!config.output) {
        callback(new Error("Você não informou o nome do arquivo json de saída."), null);
    }
    new Qualis(config, callback);
}

function Qualis(config, callback) { 
    this.xlsToJson(config.ClassificacoesPublicadas, config.output, callback);
}

Qualis.prototype.xlsToJson = function(ClassificacoesPublicadas, output) {
    require("sheet2json")(ClassificacoesPublicadas, response => {
        var json = JSON.stringify(response, null, " ");
        fs.writeFile(output, json, (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
    });
}

