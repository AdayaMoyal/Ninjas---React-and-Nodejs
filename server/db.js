var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./informationOfAttacks.db');

function createDB(){
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS attacks (id TEXT, description TEXT, name TEXT, x_mitre_platforms TEXT, x_mitre_detection TEXT, phase_name TEXT)");
    });
    insertToDB();
    };
    
  function insertToDB(){
    var dir = require('node-dir');
    dir.readFiles('./files',
        function(err, content, next) {
            var objectValue = JSON.parse(content);
            var Name = String(objectValue.objects[0].name);
            var Description = String(objectValue.objects[0].description);
            var Id = String(objectValue.objects[0].id);
            var X_mitre_platforms = String(objectValue.objects[0].x_mitre_platforms);
            var X_mitre_detection = String(objectValue.objects[0].x_mitre_detection);
            var Phase_name = String(objectValue.objects[0].kill_chain_phases[0].phase_name);
            db.all("SELECT id FROM attacks WHERE name == ?",Name,(err, rows)=> {
              if(rows == 0)
              {
                db.run('INSERT INTO attacks (id, description, name, x_mitre_platforms, x_mitre_detection, phase_name) VALUES (?, ?, ?, ?, ?, ?)',[Id, Description, Name, X_mitre_platforms, X_mitre_detection, Phase_name]);
              }
              });
            next();
        });
    };
    
  function getInfoFromDB(){
        return new Promise((resolve, reject) => {
            let information = [];
            db.all("SELECT * FROM attacks",function(err, rows) {
                rows.forEach(function (row) {
                    information.push({"name":row.name, "description":row.description, "id":row.id, "x_mitre_platforms":row.x_mitre_platforms, "x_mitre_detection":row.x_mitre_detection, "phase_name":row.phase_name,});
           resolve(information);
        });
    });
    })
    };

    module.exports ={createDB, insertToDB, getInfoFromDB};