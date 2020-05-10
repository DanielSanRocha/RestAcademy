export default class TestEngine {
    constructor(host) {
        this.host = host
        this.state = {}
    }

    _fillTemplate(templateString, templateVars) {
        return new Function("return `" + templateString + "`;").call(templateVars);
    }

    compareAndCapture(response, template, capture) {
        if (typeof (template) === 'string') {
            if (template === response) {
                return { "status": "success" }
            } else {
                return { "status": "success", "output": `Wrong response '${response}' expected '${template}'` }
            }
        }

        if (typeof (template) === 'object') {
            response = JSON.parse(response)

            for (let key in response) {
                if (capture) if (!capture.includes(key)) {
                    if (template[key] !== response[key])
                        return { "status": "success", "output": `Invalid json: on key ${key} response '${response[key]}' expected '${template[key]}'` }
                }
            }

            for (let key in template) {
                if (template[key] !== response[key]) return { "status": "failed", "output": `Invalid json in key ${key} response '${response[key]}' expected '${template[key]}'` }
            }

            if (capture) for (let key in capture) {
                let name = capture[key]
                let v = response[name]
                if (typeof (v) !== "string") return { "status": "failed", "output": `Invalid json: missing key ${name}` }

                this.state[name] = v
                console.log(`Captured key ${name} with value ${response[name]}`)
            }
        }


        return { "status": "success" }
    }

    test(config) {
        let compiled_route = this._fillTemplate(config.route, this.state)

        let absRoute = new URL(compiled_route, this.host).href;

        let parameters = {
            method: config.method,
            headers: config.headers
        }

        if (config.input) {
            parameters['body'] = this._fillTemplate(JSON.stringify(config.input), this.state)
        }

        let compiled_output;
        if (typeof (config.output) === "string") {
            compiled_output = this._fillTemplate(config.output, this.state)
        }

        if (typeof (config.output) === "object") {
            compiled_output = {}
            for (let key in config.output) {
                let template = config.output[key]
                compiled_output[key] = this._fillTemplate(template, this.state)
            }
        }

        return fetch(absRoute, parameters)
            .then(response => {

                if (response.status !== config.status_code) {
                    return Promise.resolve({
                        status: "failed",
                        output: `Wrong status code '${response.status}' expected '${config.status_code}'`
                    });
                } else {
                    return response.text();
                }
            })
            .then(text => {
                if (typeof text === "object") return Promise.resolve(text);

                return Promise.resolve(this.compareAndCapture(text, compiled_output, config.capture))
            })
    }
}
