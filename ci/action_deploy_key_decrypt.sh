#!/bin/sh

mkdir -p $HOME/.ssh
chmod 700 $HOME/.ssh
chmod 600 $HOME/.ssh/*

# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$DEPLOY_KEY_PASS" \
--output $HOME/.ssh/id_rsa action_deploy_key.gpg
echo $(ls)
echo $(ls -la $HOME/)
echo $(ls -la $HOME/.ssh)

chmod 0644 $HOME/.ssh/id_rsa
