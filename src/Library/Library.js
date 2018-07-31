import React, {Component} from 'react';
import './Library.css'

class Library extends Component {
  constructor(props) {
    super(props);
    try {
      console.log(this.props.data);
      var currentKeyName = Object.keys(this.props.data)

      var keysData=[];
      for (var i=0, item; item = this.props.data[currentKeyName][i]; i++) {
        keysData.push(Object.keys(item));
        console.log("Looping: index ", i, "item" + item);
      }
    }
    catch(error) {
      var currentKeyName = "";
      var keysData=[];
    }


    this.state={
      keyName:currentKeyName,
      levelData:keysData
    }
  }
  render() {
    return (<div>
      {this.state.levelData.map((course) =>
        <div className="subLibrary">
          <span className="clickable">{course}-{Object.keys(course)}</span>
          <span><Library data={this.props.data[this.state.keyName][Object.keys(course)]}></Library></span>
        </div>
      )}
    </div>);
  }
}

export default Library;
