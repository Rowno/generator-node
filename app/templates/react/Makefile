BIN := ./node_modules/.bin
BUILD_IGNORE = '**/*.test.js'
export BABEL_ENV = commonjs

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

commonjs: node_modules
	BABEL_ENV=commonjs $(BIN)/babel src --out-dir commonjs --source-maps inline

esm: node_modules
	BABEL_ENV=esm $(BIN)/babel src --out-dir esm --source-maps inline

build: commonjs esm
.PHONY: build

clean:
	rm -rf commonjs esm
.PHONY: clean
