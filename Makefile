install-jmeter:
	java -version
	wget https://downloads.apache.org//jmeter/binaries/apache-jmeter-5.6.3.zip
	unzip apache-jmeter-5.6.3.zip
	./apache-jmeter-5.6.3/bin/jmeter -v

start-mirror-server:
	echo "Fix bad Jmeter lib names."
	mv ./apache-jmeter-5.6.3/lib/log4j-slf4j-impl-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-slf4j-impl-2.11.0.jar
	mv ./apache-jmeter-5.6.3/lib/log4j-api-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-api-2.11.1.jar
	mv ./apache-jmeter-5.6.3/lib/log4j-core-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-core-2.11.1.jar
	mv ./apache-jmeter-5.6.3/lib/log4j-1.2-api-2.22.1.jar ./apache-jmeter-5.6.3/lib/og4j-1.2-api-2.11.1.jar
	echo "Starting the mirror server on port 8081."
	./apache-jmeter-5.6.3/bin/mirror-server &

test:
	sh ./test.sh
