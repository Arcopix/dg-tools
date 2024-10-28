SHELL=/bin/bash

all: chrome firefox

firefox:
	@mkdir -p out
	$(shell cd src && jq ".version = \"`cat ../VERSION`\"" < manifest-firefox.json > manifest.json.tmp && mv manifest.json.tmp manifest.json)
	@cd src && zip ../out/dg-plus-firefox.zip -r *

chrome:
	@mkdir -p out
	$(shell cd src && jq ".version = \"`cat ../VERSION`\"" < manifest-chrome.json > manifest.json.tmp && mv manifest.json.tmp manifest.json)
	@cd src && zip ../out/dg-plus-chrome.zip -r *

clean:
	@rm out/dg-plus-chrome.zip
