const fs = require('fs'),
      pdf = require('pdf-parse');


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    this.parsePdfToTxt(config.arquivoConferencias, callback);
}


Conferencia.prototype.parsePdfToTxt = function(arquivoConferencias) {

    pdf(fs.readFileSync(arquivoConferencias)).then(function(data) {
        fs.writeFileSync(
            './conferencias.txt', 
            data.text, 
            function(err) {
                if(err) {
                    return console.log("Erro na escrita do arquivo: " + err);
                }
            }  
        ); 
    });
}
