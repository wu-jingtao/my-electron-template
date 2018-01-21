import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as classnames from 'classnames';

const package_json = require('../../../package.json');

class Root extends React.Component {

    render() {
        return (
            <div id="root">
                <h1>{package_json.name}</h1>
                <h2>{package_json.description}</h2>
                <h3>{package_json.version}</h3>
                <h4>{package_json.author}</h4>
            </div>
        );
    }
}

ReactDom.render(<Root />, document.getElementById('app'));