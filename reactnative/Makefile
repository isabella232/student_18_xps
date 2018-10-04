UNAME_S := $(shell uname -s)
npm :=
ifeq ($(UNAME_S),Darwin)
	npm += CXX=clang++
endif
npm += npm

clean-install: clean

# This is where we apply patches needed to the modules that we depend on.
apply-patches: init-npm
	git apply --ignore-whitespace nodeify_temporary_patch.patch
	git apply --ignore-whitespace websockets_temporary_patch.patch

init-npm:
	$(npm) install

clean:
	rm -rf node_modules platforms hooks