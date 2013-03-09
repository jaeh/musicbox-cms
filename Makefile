
MOCHA_OPTS= -cd -t 20000
REPORTER = dot

check: test jslint

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

jslint:
	rm -f ./jslint.log
	jslint ./*.js --nomen >> ./jslint.log
	jslint ./*.json --nomen >> ./jslint.log
	jslint ./test/*.js ./test/*.js --nomen >> ./jslint.log
	jslint ./config/*.js --nomen >> ./jslint.log
	jslint ./views/*/*.js --nomen >> ./jslint.log
	jslint ./controllers/*.js --nomen >> ./jslint.log
	jslint ./routes/*.js --nomen >> ./jslint.log
	jslint ./lib/*.js --nomen >> ./jslint.log


clean:
	rm -f ./jslint.log

.PHONY: test jslint check clean
