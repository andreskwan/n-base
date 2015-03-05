DEFAULT:
	make test
# '--ui bdd --reporter spec -r test/helpers/setup -w'
ARGS=--ui bdd --reporter spec -r test/helpers/setup -w
#-r test/helpers/setup -w

test:
	# ./node_modules/.bin/mocha $(ARGS) test/
	echo $(ARGS)
	./node_modules/.bin/mocha $(ARGS) test/

.PHONY: \
	DEFAULT \
	test \
