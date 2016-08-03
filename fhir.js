//code base on: https://github.com/SBU-BMI/fhir

console.log('start fihr.js');

var defaultUrl   = "https://open-api.fhir.me/";
var typeofString = "string";
var errorMsg     = "error: ";
var colorNavy    = "navy";

FHIR = function(url) {
    if (!url) {
        url = defaultUrl;
    }
    this.url = url;

    this.parmUnpack = function(x) {
        y = '';
        if (Array.isArray(x)) {
            x.forEach(function(xi) {
                y += xi + '&';
            })
        } else {
            for (var p in x) {
                y += p + '=' + x[p] + '&';
            }
        }
        return y;
    }

    this.getJSON = function(url, h) {        
        var getJSON = function(u, fun, onErr) {
            if (!u) {
                u = this.url;
            }
            if (!fun) {
                fun = function(x) {
                    console.log('retrieved:', x);
                }
            }
            if (!onErr) {
                onErr = function(x) {
                    console.log(errorMsg, x);
                }
            }
            var c = 0;
            var xhr = new XMLHttpRequest();
            xhr.open('get', u, true);
            // protocol, url, assynchronic call
            xhr.send();
            xhr.onload = function(x) {
                try {
                    fun(JSON.parse(x.target.response));
                } catch (e) {
                    onErr(e);
                }
            }
            xhr.onerror = function(x) {
            }
        }
        return new Promise(function(resolve, reject) {
            getJSON(url, function(x) {
                resolve(x);
            }, function(x) {
                reject(x);
            })
        }
        )
    }

    this.Patient = function(uid, fun) {
        if (fun) {
            return this.Patient(uid).then(function(x) {
                fun(x);
            }).catch(function(e) {
                console.log(errorMsg, e);
            })
        } else {
            if (!uid) {
                // no uid provided, get the list
                return this.getJSON(this.url + "Patient?_format=json");
            } else {
                if (typeof (uid) === typeofString) {
                    return this.getJSON(this.url + 'Patient/' + uid + '?_format=json');
                } else if (uid.length === 0) {
                    // to allow for empty Arrays
                    return this.Patient(false);
                } else {
                    return this.getJSON(this.url + 'Patient/?' + this.parmUnpack(uid) + '_format=json');
                }
            }
        }
    }

    this.pre=function(x,id){ // show JSON in a <pre> element, create one if t doesn't exist
        if(!id){
            id='FHIRpre';
        }
        if(!document.getElementById(id)){
            var pre = document.createElement('pre');
            pre.id=id;
            document.body.appendChild(pre);
        }
        var pre = document.getElementById(id);
        pre.innerHTML=JSON.stringify(x,null,3);
        pre.style.color=colorNavy;
        4;

    }
}

   //show Patient resource
   this.showPatients = function(){
    // list patients
    var x = new FHIR();
    var div = document.createElement('div');
    div.id='ui1';
    document.body.appendChild(div);
    var h = '<button id="getPatientData">Get Patient data</button><pre id="FHIRpre"></pre>';
    div.innerHTML= h;
    var getPatientDataButton = document.getElementById('getPatientData');
    getPatientDataButton.onclick=function(){
        x.Patient()
         .then(function(dt){
             x.pre(dt);
         })
    }
    
    4;
}

// test show Patient resource
this.showPatients();