
### Set up

#### Pre req

```
cd /path/to/clone
git clone https://github.com/rrag/react-stockcharts.git

npm i
```

#### Clone the repo

```
cd /path/to/clone

git clone https://github.com/rrag/react-stockcharts-examples.git

cd react-stockcharts-examples
git submodule init
git submodule update
```

#### Install dependencies

```
npm i
```

### Test the examples



### Create gist

```
function create_gist() {
	TOKEN=$1
    CHART_NAME=$2
    rm -f gistTemplate/new.json
    sed "s/\"description\": .*$/\"description\": \"$CHART_NAME with react-stockcharts\",/" gistTemplate/body.json > gistTemplate/new.json

    curl \
        -H "Authorization: token $TOKEN" \
        --data @gistTemplate/new.json \
        https://api.github.com/gists | grep '"url": "https://api.github.com/gists/'
}

$ create_gist <github auth token> <chart name>
```