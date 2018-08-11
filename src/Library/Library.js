import React, {Component} from 'react';
import './Library.css'

class Library extends Component {
  constructor(props) {
    super(props);
    try {
      console.log(this.props.data);
      var currentKeyName = Object.keys(this.props.data)

      var creator_has_sublibrary=false;
      var creator_open_sublibrary = false;
      if(this.props.root){
        creator_open_sublibrary = true;
      }
      var keysData=[];
      if(window.isArray(this.props.data[currentKeyName])){
        for (var i=0, item; item = this.props.data[currentKeyName][i]; i++) {
          keysData.push(Object.keys(item));
          console.log("Looping: index ", i, "item" + item);
        }
        creator_has_sublibrary = true;
      }
    }
    catch(error) {
      var currentKeyName = "";
      var keysData=[];
    }

    this.state={
      keyName:currentKeyName,
      levelData:keysData,
      has_sublibrary:creator_has_sublibrary,
      open_sublibrary:creator_open_sublibrary
    }
    this.toggle_sublibrary = this.toggle_sublibrary.bind(this);
  }

  toggle_sublibrary(){
    var current_sublibrary_state=this.state.open_sublibrary;
    this.setState({
      open_sublibrary:!current_sublibrary_state
    });
  }

  render() {
    return (<span>
      {this.state.has_sublibrary &&
        <span>
          {this.state.open_sublibrary ?
            <span className="clickable" onClick={this.toggle_sublibrary}>contraer</span> :
            <span className="clickable" onClick={this.toggle_sublibrary}>extender</span>
          }
        </span>
      }
      <div>
      {this.state.has_sublibrary &&
        <span>{this.state.open_sublibrary &&
          <span>{this.state.levelData.map((course) =>
            <div className="subLibrary directory">
              <span className="container parent_directory">
                <span className="row">
                  <span className="col-sm-6">
                    {course}
                  </span>
                  <span className="directory_menu col-sm-6">
                    <button className="round_button" title="Nueva carpeta">
                      &nbsp; + &nbsp;
                    </button>
                    &nbsp;
                    <button className="round_button" title="Eliminar carpeta">
                      &nbsp; X &nbsp;
                    </button>
                  </span>
                </span>
              </span>
              <span> &nbsp; <Library root={false} data={this.props.data[this.state.keyName][Object.keys(course)]}></Library></span>
            </div>
          )}</span>
        }</span>
      }
    </div>
  </span>);
  }
}

export default Library;
