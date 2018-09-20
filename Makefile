REL_TAG=$(shell echo r_`date '+%Y%m%d-%H%M%S'`)

release:
	git checkout dev
	git tag -a $(REL_TAG) -m "Release $(REL_TAG)"
	git push origin $(REL_TAG)
