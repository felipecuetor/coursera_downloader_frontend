import React, {Component} from 'react';
import './LessonFileList.css';

class LessonFileList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <span className="clickable" onClick={this.props.close}>close</span>
      <br/>
      {this.props.files.map((file) =>
        <p>{file.file_name} - <span className = "file_path">{file.file_directory}</span></p>
      )}
    </div>);
  }
}

export default LessonFileList;
