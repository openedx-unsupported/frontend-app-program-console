
.PHONY: help extract_translations, i18n.extract i18n.concat \
        detect_changed_source_translations push_translations \
        pull_translations validate-no-uncommitted-package-lock-changes \
        test quality validate

# Generates a help message. Borrowed from https://github.com/pydanny/cookiecutter-djangopackage.
help: ## display this help message
	@echo "Please use \`make <target>\` where <target> is one of"
	@perl -nle'print $& if m{^[\.a-zA-Z0-9_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

extract_translations: ## 
	# no prerequisites so we can control order of operations
	echo "We have to define this target due to tooling assumptions"
	echo "Also we have to npm install using this hook b/c there's no other place for it in the current setup"
	npm install
	npm run-script i18n_extract

i18n.extract: ## 
    # Pulling display strings from .jsx files into .json files...
	npm run-script i18n_extract

i18n.concat: ## 
    # Gathering JSON messages into one file...
	./src/i18n/i18n-concat.js ./temp/src ./src/i18n/transifex_input.json

detect_changed_source_translations: ## 
	git diff --exit-code ./src/i18n/transifex_input.json

tx_url1 = https://www.transifex.com/api/2/project/edx-platform/resource/frontend-app-program-manager/translation/en/strings/
tx_url2 = https://www.transifex.com/api/2/project/edx-platform/resource/frontend-app-program-manager/source/

push_translations: | i18n.extract ## push translations to Transifex, doing magic so we can include the translator comments
	# Adding translator comments...
	# Fetching strings from Transifex...
	./node_modules/reactifex/bash_scripts/get_hashed_strings.sh $(tx_url1)
    # Writing out comments to file...
	./src/i18n/i18n-concat.js ./temp/src --comments
    # Adding comments to Transifex...
	./node_modules/reactifex/bash_scripts/put_comments.sh $(tx_url2)

pull_translations: ## pull translations from Transifex
	# ^ must be exactly this name for edx tooling support, see ecommerce-scripts/transifex/pull.py
	tx pull -f --mode reviewed --language="ar,fr,es_419,zh_CN"

validate-no-uncommitted-package-lock-changes: ## ensure package-lock.json is committed
	git diff --exit-code package-lock.json
