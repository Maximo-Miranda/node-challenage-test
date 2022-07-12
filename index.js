const fs = require("fs")
const crypto = require("crypto")
const request = require("request")

async function main() {

    try {

        let elementsParse = [] 
        const apiResponse = await api()        
        const file = "./output.txt"

        elementsParse = parseElements(apiResponse)
        
        for (var [key, value] of Object.entries(elementsParse)) {
            if (value.value == "32") {

                const SHAValue = crypto.createHash("sha1").update(value.key, "binary").digest("hex")

                if (fs.existsSync(file)) {

                    fs.appendFile(file, "\n" + SHAValue, "utf8", function (err) {
                        if (err) throw err;
                    });

                } else {

                    fs.writeFileSync(file, SHAValue, "utf8");
                }

            }
        }

    } catch (error) {
        console.error(error);
    }

}

function parseElements(data) {

    let elements = []
    
    for (let [key, value] of Object.entries(data)) {
        for (let i = 0; i < value.length; i = i + 2) {
            let element = {}
            element.key = value[i].replace('{"data":"key=', '').replace(' key=', '')
            element.value = value[i + 1].replace(' age=', '').replace('"}', '')
            elements.push(element);
        }
    }

    return elements

}

async function api() {
 
  const options = {
    method: "get",
    url: "https://coderbyte.com/api/challenges/json/age-counting",
    headers: {},
  };

  return new Promise(function (resolve, reject) {

    try {

      request(options, async function (error, res, body) {
        const array = res.body.split(",");
        resolve({ body: array, statusCode: res.statusCode });
      });

    } catch (error) {
      console.error(error);
    }

  });

}

main()