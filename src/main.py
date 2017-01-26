
import pandas as pd
import json
from elasticsearch import Elasticsearch
es = Elasticsearch("esearch.colo.seagate.com")

search = """{
"size": 1000,
"query": {
    "range": {
        "data.percent": {
            "from": 70,
            "to": 100
        }
    }
}
}"""

def getData1():
    res = es.search(index="inventory", body=search)

    data = []
    for a in map( lambda x: x['_source'],  res['hits']['hits'] ):
        if 'os' in a:
            z = [ a['host'], a['os'] ]
            header = ['host','os']

            for y in a['data']:
                header.append(y['Device'])
                z.append( y['percent'])

        data.append( pd.Series(z, index=header, name=a['host']) )

    allData = pd.concat(data, axis=1, keys=[s.name for s in data]).fillna(0).transpose().reindex()
    
    yvalues = list(map(lambda x: x.split(".")[0], allData.index.tolist() ))
    xvalues = allData.columns.tolist()
    
    # remove the host and os columns as this report doesn't need them.
    xvalues.remove('host')
    xvalues.remove('os')
    allData.drop(allData.columns[len(allData.columns)-1], axis=1, inplace=True)
    allData.drop(allData.columns[len(allData.columns)-1], axis=1, inplace=True)
    
    print( allData.values.tolist() )
    return json.dumps( { 'x': xvalues, 'y': yvalues, 'z': allData.values.tolist()  } ) 
    

def getData2():
    res = es.search(index="inventory", body=search)

    data = []
    for a in map( lambda x: x['_source'],  res['hits']['hits'] ):
        if 'os' in a:
            z = [ a['host'], a['os'] ]
            header = ['host','os']

            for y in a['data']:
                header.append(y['Device'])
                z.append( y['percent'])

            data.append( pd.Series(z, index=header, name=a['host']) )

    allData = pd.concat(data, axis=1, keys=[s.name for s in data]).fillna(0).transpose().reindex()

    yvalues = allData['os'].unique().tolist()
    xvalues = allData.columns.tolist()
    zvalues = []

    for os in yvalues:
        tmp = []
        for part in xvalues:
            if part[0] == "/":
                tmp.append(  len( allData[ (allData[part] > 20) & (allData['os'] == os) ] )   )
        zvalues.append(tmp)
    
    return json.dumps( { 'x': xvalues , 'y': yvalues, 'z': zvalues } ) 

from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('plot1.html')

@app.route("/data1")
def fun1():
    return getData1()

@app.route("/data2")
def fun2():
    return getData2()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')


