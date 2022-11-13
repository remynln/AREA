#!/bin/bash
function remove_env() {
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
}

force=""

if [ -n $1 ] && [ "$1" == "-f" ]; then
    force="-f"
    echo "Force enabled"
fi


for branch in $(git for-each-ref --format='%(refname:short)'); do
    true_branch_name=$(echo $branch | sed -e 's/\origin\///g')
    git checkout -f $true_branch_name --no-guess > /dev/null
    env_file=$(find . -type f -name ".env" ! -path "./front-web/*" ! -path "./area_api/node_modules/*" | cut -c 3-)
    if [ -z $env_file ]; then
        echo -e "\e[32mno .env in $true_branch_name\e[0m"
    else
        echo -e "\e[31m\e[1m\e[4m.env founded at $env_file in $true_branch_name\e[0m"
        remove_env $env_file $force
    fi
done