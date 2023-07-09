const fs = require('fs'),
      sheet2json = require("sheet2json"),
      xmlToJson = require('xml-js');
let   jsonLattesObj, jsonQualisObj;
const iconv = require('iconv-lite');


module.exports = function () {


    this.parseXmlFileToJson = function (curriculoLattes) { 
        
        var xml = fs.readFileSync(curriculoLattes, 'binary', function (err, data) {
            if (err) {
              return console.log(err);
            }
        }),
        options = {
            ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
        };

        // console.log(xml);

        // xml = iconv.decode(xml, 'iso88591');
        jsonLattesObj = xmlToJson.xml2json(xml, options);
        jsonLattesObj = JSON.parse(jsonLattesObj);
    
        return jsonLattesObj; 
    }



    this.parseXlsFileToJson = function (classificacoesPublicadasXLS) {

        sheet2json(classificacoesPublicadasXLS, response => {

            jsonQualisObj = JSON.stringify(response, null, " ");
        });

        jsonQualisObj = JSON.parse(jsonQualisObj);

        var sjson = JSON.stringify(jsonQualisObj);

        const fs = require('fs');
        fs.writeFile("qualis.json", sjson, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file 'qualis.json' was saved!");
        }); 

        return jsonQualisObj;
    }
}
