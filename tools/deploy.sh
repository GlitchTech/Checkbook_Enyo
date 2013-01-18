#!/bin/bash

RELEASE=0
RELEASEDIR=""
DEPLOY="enyo/tools/deploy.js"

# Parse command line options.
for var in "$@"; do
	case "$var" in
		-h)
			echo "
USAGE ./tools/deploy_android.sh [-h] [-r]

-h Display this message.
-r Build from latest master release.

Other arguments pass directly to $DEPLOY
----------------"

$DEPLOY -h
			exit 0
			;;
		--release) RELEASE=1;;
	esac
done

#Check for output director
while getopts "o:" OPTION; do
	case $OPTION in
		o)
			RELEASEDIR=$OPTARG;;
	esac
done

if [ $RELEASE -eq 1 ]; then

	#Checkout master
	git stash
	CURRENT=$(git rev-parse --abbrev-ref HEAD)
	TAG=$(git describe --tags $(git rev-list --tags --max-count=1))
	git checkout $TAG
	git submodule update
fi

node $DEPLOY $@

if [ -n $RELEASEDIR ]; then

	echo "Copying appinfo.json..."
	cp "appinfo.json" $RELEASEDIR
fi

if [ $RELEASE -eq 1 ]; then

	git checkout $CURRENT
	git submodule update
	git stash apply

	cat <<EOF

Deployed release $TAG
EOF
fi
