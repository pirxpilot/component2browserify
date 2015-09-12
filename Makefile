check: lint

lint:
	./node_modules/.bin/jshint index.js

.PHONY: check lint test
