# Data setup

## Login as admin user

Login using your preferred method before running setup. This is because the
first login method is difficult to change.


## Load the analyses

Load the analyses into the Analysis records.

npm run ts-script load-analyses


## Run setup

This will apply the currently selected LLMs (their Tech records) to the active
Analysis records.

npm run ts-script setup

