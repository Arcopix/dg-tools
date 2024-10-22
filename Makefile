SHELL=/bin/bash

all:
	@mkdir -p out
	$(shell cd src && jq ".version = \"`cat ../VERSION`\"" < manifest.json > manifest.json.tmp && mv manifest.json.tmp manifest.json)
	@cd src && zip ../out/dg-plus.zip -r *

clean:
	@rm out/dg-plus.zip
