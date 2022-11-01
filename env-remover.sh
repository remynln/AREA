#!/bin/bash
if [[ -z $1 ]];then
	echo "Require at least one argument, check help"
	exit 1
fi
if [[ $1 == "-h" ]];then
	echo "./env-remover.sh \"<path to the env file>\" -f (optional force everything)"
	exit 1
fi
filepath=$1
remote=$(git config --get remote.origin.url)
branch=$(git rev-parse --abbrev-ref HEAD)
if [[ -z $2 ]];then
	git filter-repo --path $filepath --invert-paths
	git remote add origin $remote
	git push --set-upstream origin $branch --force
elif [[ $2 == "-f" ]];then
	git filter-repo --path $filepath --invert-paths --force
        git remote add origin $remote
        git push --set-upstream origin $branch --force
else
	echo "Bad syntax"
	exit 1
fi
# dedicace a marco
