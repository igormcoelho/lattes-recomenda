const fs = require('fs'),
      pdf = require('pdf-parse');
let   conferenciasQualis = [];


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    this.parsePdfToTxt(config.arquivoConferencias, callback);
    this.salvaConferencias();
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

Conferencia.prototype.salvaConferencias = function() {
    fs.readFile("./conferencias.txt", 'utf8', function(err, data) {
        if (err) throw err;
        
        conferenciasQualis = data.toString().split("\n");
    });
}