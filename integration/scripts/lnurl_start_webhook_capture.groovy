import com.sun.net.httpserver.HttpHandler
import com.sun.net.httpserver.HttpServer
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import java.util.concurrent.ConcurrentHashMap

def requests = new ConcurrentHashMap<String, String>()
def server = HttpServer.create(
    new InetSocketAddress('127.0.0.1', vars.get('webhookCapturePort').toInteger()), 0)
server.createContext('/', { exchange ->
    try {
        def body = new JsonSlurper().parseText(exchange.requestBody.getText('UTF-8'))
        requests.put(body.payment_hash, JsonOutput.toJson([
            method: exchange.requestMethod,
            header: exchange.requestHeaders.getFirst('h1'),
            body: body
        ]))
        byte[] response = 'Webhook response must not appear in payment metadata'.getBytes('UTF-8')
        exchange.sendResponseHeaders(200, response.length)
        exchange.responseBody.write(response)
    } finally {
        exchange.close()
    }
} as HttpHandler)
server.start()
props.put('lnurlWebhookRequests', requests)
props.put('lnurlWebhookServer', server)
