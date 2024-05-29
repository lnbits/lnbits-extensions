install-jmeter:
	java -version
	wget https://downloads.apache.org//jmeter/binaries/apache-jmeter-5.6.3.zip
	unzip apache-jmeter-5.6.3.zip
	./apache-jmeter-5.6.3/bin/jmeter -v

start-mirror-server:
	echo "Fix bad Jmeter lib names."
	cp ./apache-jmeter-5.6.3/lib/slf4j-api-1.7.36.jar ./apache-jmeter-5.6.3/lib/slf4j-api-1.7.25.jar
	cp ./apache-jmeter-5.6.3/lib/log4j-slf4j-impl-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-slf4j-impl-2.11.0.jar
	cp ./apache-jmeter-5.6.3/lib/log4j-api-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-api-2.11.1.jar
	cp ./apache-jmeter-5.6.3/lib/log4j-core-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-core-2.11.1.jar
	cp ./apache-jmeter-5.6.3/lib/log4j-1.2-api-2.22.1.jar ./apache-jmeter-5.6.3/lib/log4j-1.2-api-2.11.1.jar
	echo "Starting the mirror server on port 8500."

	./apache-jmeter-5.6.3/bin/mirror-server --port 8500 &

test:
	sh ./test.sh
