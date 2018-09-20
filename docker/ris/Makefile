get-src:
	rm -fr ./src
	git clone -b jrd_react_2 --depth 1 git@github.com:RadiologyTechnology/PACS_RIS.git src

pull:
	docker pull 288170449575.dkr.ecr.us-east-2.amazonaws.com/dev/ris:latest

build:
	docker build --pull -t 288170449575.dkr.ecr.us-east-2.amazonaws.com/dev/ris:latest .

push:
	docker push 288170449575.dkr.ecr.us-east-2.amazonaws.com/dev/ris:latest

release:
	make get-src
	make build
	make push
