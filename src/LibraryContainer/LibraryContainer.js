import React, {Component} from 'react';
import Library from './Library/Library.js';

class LibraryContainer extends Component {
  constructor(props) {
    super(props);
    this.getDirectoryTree = this.getDirectoryTree.bind(this);
  }

  componentWillMount() {
    var directory_tree = this.getDirectoryTree()

    this.setState({
      directory_tree_json : directory_tree
    });
  }

  getDirectoryTree()
  {
    var url = "http://172.24.98.22/development/directory_tree/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var directory_tree = JSON.parse(xmlHttp.responseText);
    return directory_tree
  }

  render() {
    return (<div>
      <span>Archivos &nbsp; <Library root={true} data={this.state.directory_tree_json}> </Library>
      </span>
    </div>);
  }
}

export default LibraryContainer;
