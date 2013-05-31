#!/bin/bash

RELEASE=0
RELEASEDIR=""

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)

# enyo location
ENYO="$TOOLS/../enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# release director location
RELEASEDIR="$TOOLS/../deploy/gutoc"

# Parse command line options.
while getopts "hro:" OPTION; do
	case $OPTION in
		h)
			echo "
-h Display this message.
-r Build from latest master release.

Other arguments pass directly to $DEPLOY
----------------"

$DEPLOY -h
			exit 0
			;;
		r) RELEASE=1;;
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

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
	echo "enyo/tools/minify.sh args: " $@
	node $DEPLOY $@
else
	echo "No node found in path"
	exit 1
fi

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
