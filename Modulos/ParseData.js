const fs = require('fs'),
      sheet2json = require("sheet2json"),
      xmlToJson = require('xml-js');
let   jsonLattesObj, jsonQualisObj;
const iconv = require('iconv-lite');


module.exports = function () {
    

    this.parseXmlToJson = function (curriculoLattes) { 
        
        var xml = fs.readFileSync(curriculoLattes, 'binary', function (err, data) {
            if (err) {
              return console.log(err);
            }
        }),
        options = {
            ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
        };

        // xml = iconv.decode(xml, 'iso88591');
        jsonLattesObj = xmlToJson.xml2json(xml, options);
        jsonLattesObj = JSON.parse(jsonLattesObj);
    
        return jsonLattesObj; 
    }


    this.parseXlsToJson = function (classificacoesPublicadas) {

        sheet2json(classificacoesPublicadas, response => {

            jsonQualisObj = JSON.stringify(response, null, " ");
        });

        jsonQualisObj = JSON.parse(jsonQualisObj);

        return jsonQualisObj;
    }
}
