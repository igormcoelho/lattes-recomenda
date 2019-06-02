const fs = require('fs');
const path = require('path');


module.exports = function () {


    this.retornaJsonObj = function (filepath) { 

        let file = path.join(__dirname, filepath);
    
        let data = fs.readFileSync(file, 'utf8', function(err, data) {
    
            if (err) throw err;               
        });
    
        return JSON.parse(data);
    }
}