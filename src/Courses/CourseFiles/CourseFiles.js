import React, {Component} from 'react';
import Library from './Library/Library.js';

class CourseFiles extends Component {
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
    var url = window.rest_service_address+"/course_directory_tree/?course_id="+this.props.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText)
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

export default CourseFiles;
