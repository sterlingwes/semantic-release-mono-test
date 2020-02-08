#!/bin/sh

mkdir -p $HOME/.ssh
chmod 700 $HOME/.ssh
chmod 600 ~/.ssh/*

# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$DEPLOY_KEY_PASS" \
--output $HOME/.ssh/id_rsa action_deploy_key.gpg
chmod 0644 ~/.ssh/id_rsa
