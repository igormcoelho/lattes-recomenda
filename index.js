var fs = require('fs'),
    convert = require('xml-js');

exports = module.exports = AvaliacaoQualis;

function AvaliacaoQualis(config, callback) {
    if (!config.ClassificacoesPublicadas) {
        callback(new Error("Você não informou o arquivo xls de entrada."), null);
    } else if (!config.curriculoLattes) {
        callback(new Error("Você não informou o arquivo xml de entrada."), null);
    } else if (!config.output) {
        callback(new Error("Você não informou o nome do arquivo json de saída."), null);
    } 
    
    new Qualis(config, callback);
}

function Qualis(config, callback) { 
    this.xlsToJson(config.ClassificacoesPublicadas, config.output, callback);
    this.xmlToJson(config.curriculoLattes);
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

Qualis.prototype.xmlToJson = function (curriculoLattes) {
    var xml = fs.readFileSync(curriculoLattes, 'utf8'),
    options = {
        ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
    },
    result = convert.xml2json(xml, options); 

    fs.writeFile(
        "curriculo-lattes.json", 
        result, 
        function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("Arquivo convertido para formato json com sucesso.");
        }  
    ); 
}