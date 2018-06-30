BIN := ./node_modules/.bin

node_modules: package.json yarn.lock
	yarn install
	touch $@

test: node_modules
	$(BIN)/xo
	$(BIN)/ava
.PHONY: test

test-watch: node_modules
	$(BIN)/ava --watch
.PHONY: test-watch

test-update-snapshots: node_modules
	$(BIN)/ava --update-snapshots
.PHONY: test-update-snapshots
