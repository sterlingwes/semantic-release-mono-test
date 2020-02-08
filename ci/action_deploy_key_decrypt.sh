#!/bin/sh

mkdir -p $HOME/.ssh
chmod 700 $HOME/.ssh

# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$DEPLOY_KEY_PASS" \
--output $HOME/.ssh/id_rsa action_deploy_key.gpg

chmod 600 $HOME/.ssh/id_rsa
