package_version := $(shell python -c "from package import version; print(version)")

check:
	ruff check server --fix
	ruff format server
	mypy server/


release: check 
	python create_package.py

	echo $(package_version)

	git checkout main && git pull && git merge develop && git push
	git tag -a $(package_version) -m "Version $(package_version)" && git push --tags

	gh release create \
		$(package_version) \
		package/planner-$(package_version).zip \
		-t $(package_version) \
		--generate-notes

	git checkout develop

