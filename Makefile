install-jmeter:
	java -version
	wget https://downloads.apache.org//jmeter/binaries/apache-jmeter-5.6.2.zip
	unzip apache-jmeter-5.6.2.zip
	./apache-jmeter-5.6.2/bin/jmeter -v

start-mirror-server:
	libs_dir=./apache-jmeter-5.6.2/lib/
	echo "Fix bad Jmeter lib names."
	mv ./apache-jmeter-5.6.2/lib/slf4j-api-1.7.36.jar ./apache-jmeter-5.6.2/lib/slf4j-api-1.7.25.jar
	mv ./apache-jmeter-5.6.2/lib/log4j-slf4j-impl-2.20.0.jar ./apache-jmeter-5.6.2/lib/log4j-slf4j-impl-2.11.0.jar
	mv ./apache-jmeter-5.6.2/lib/log4j-api-2.20.0.jar ./apache-jmeter-5.6.2/lib/log4j-api-2.11.1.jar
	mv ./apache-jmeter-5.6.2/lib/log4j-core-2.20.0.jar ./apache-jmeter-5.6.2/lib/log4j-core-2.11.1.jar
	mv ./apache-jmeter-5.6.2/lib/log4j-1.2-api-2.20.0.jar ./apache-jmeter-5.6.2/lib/og4j-1.2-api-2.11.1.jar
	echo "Starting the mirror server on dfault port 8081."
	./apache-jmeter-5.6.2/bin/mirror-server &

test:
	sh ./test.sh
