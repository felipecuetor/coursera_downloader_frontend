import React, {Component} from 'react';
import './Download.css';

class Download extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div>
      <div class="downloadConent"><span class="downloadSeperator">Nombre del Curso:</span> <input type="text" name="courseURL" class="downloadSeperator"></input><button class="downloadSeperator">Add</button></div>
    </div>);
  }
}

export default Download;
