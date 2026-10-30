import groovy.json.JsonSlurper
import java.util.concurrent.TimeUnit

def deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(30)
def poll = sampler.clone()
poll.setConnectTimeout('2000')
poll.setResponseTimeout('2000')
def response = prev

// Stop on a completed delivery (including failure) or an HTTP error.
while (response.successful && System.nanoTime() < deadline) {
    def payment = new JsonSlurper().parseText(response.responseDataAsString)
    if (payment.details?.extra?.containsKey('wh_success')) {
        break
    }
    Thread.sleep(250)
    response = poll.sample()
    prev.addSubResult(response)
}

// The existing assertions must inspect the final response, including failures.
if (!response.is(prev)) {
    prev.setResponseData(response.responseData)
    prev.setResponseCode(response.responseCode)
    prev.setResponseMessage(response.responseMessage)
    prev.setSuccessful(response.successful)
    prev.setEndTime(System.currentTimeMillis())
}
