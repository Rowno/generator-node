REPORTER = dot
GREP = '.*'

test:
	./node_modules/.bin/mocha --require should --reporter $(REPORTER) --grep $(GREP)

.PHONY: test