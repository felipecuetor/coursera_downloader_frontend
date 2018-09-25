import React, {Component} from 'react';
import './Library.css'
import MovePopUpInput from './MovePopUpInput/MovePopUpInput.js'

class Library extends Component {
  constructor(props) {
    super(props);
    try {
      console.log(this.props.data);
      console.log("KeyName>");
      console.log(Object.keys(this.props.data));
      var currentKeyName = Object.keys(this.props.data)[0]
      var file_id = this.props.data[currentKeyName];

      var creator_has_sublibrary=false;
      var creator_open_sublibrary = false;
      if(this.props.root){
        creator_open_sublibrary = true;
      }
      var keysData=[];
      if(window.isArray(this.props.data[currentKeyName])){
        for (var i=0, item; item = this.props.data[currentKeyName][i]; i++) {
          var item_key = Object.keys(item)[0];
          keysData.push(item);
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
      open_sublibrary:creator_open_sublibrary,
      id:file_id,
      moving_file:false,
      file_moving:null

    }
    this.move_file = this.move_file.bind(this);
    this.cancel_movement = this.cancel_movement.bind(this);

    if(creator_has_sublibrary){
      this.toggle_sublibrary = this.toggle_sublibrary.bind(this);
      this.drop = this.drop.bind(this);
      this.allowDrop = this.allowDrop.bind(this);
    }

    if(!creator_has_sublibrary){
      this.drag = this.drag.bind(this);
    }

  }

  toggle_sublibrary(){
    var current_sublibrary_state=this.state.open_sublibrary;
    this.setState({
      open_sublibrary:!current_sublibrary_state
    });
  }

  move_file(course){
    var new_file_location = prompt("Escribe la nueva ruta del archivo. Entre cada carpeta coloca el simbolo >>>. Al final debes incluir el nombre del archivo.",
     "");

     if (new_file_location == null || new_file_location == "") {
     } else {
       var item_key = Object.keys(course)[0];
       "{'file_course_location':'"+new_file_location+"'}"
       var url = "/development/move_file/"+course[item_key]+"?file_course_location="+new_file_location+"";
       var xmlHttp = new XMLHttpRequest();
       xmlHttp.open( "GET", url, false ); // false for synchronous request
       xmlHttp.send(null);
       var directory_tree = JSON.parse(xmlHttp.responseText);
     }

  }

  cancel_movement(){
    this.setState({
      moving_file:false,
      file_moving:null
    });
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
      ev.dataTransfer.setData("file_name", this.state.keyName);
      ev.dataTransfer.setData("file_id", this.state.id);
  }

  drop(ev) {
      ev.preventDefault();
      var file_name = ev.dataTransfer.getData("file_name");
      var file_id = ev.dataTransfer.getData("file_id");
      console.log(file_name);
      console.log(file_id);
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
          <span>{this.state.levelData.map((course, index) =>
            <div className="subLibrary directory" draggable="true" onDragStart={(event) => this.drag(event)} onDrop={(event) => this.drop(event)} onDragOver={(event) => this.allowDrop(event)}>
              <span className="container parent_directory">
                <span className="row">
                  <span className="col-sm-6">
                    {Object.keys(course)[0]}
                  </span>
                  <span className="directory_menu col-sm-6">
                    <button className="round_button" title="Nueva carpeta">
                      &nbsp; + &nbsp;
                    </button>
                    &nbsp;
                    <button className="round_button" title="Eliminar carpeta">
                      &nbsp; X &nbsp;
                    </button>
                    <button className="round_button" title="Mover archivo" onClick={() => this.move_file(course)}>
                      &nbsp; Mover &nbsp;
                    </button>
                  </span>
                </span>
              </span>
              <span> &nbsp; <Library root={false} data={this.props.data[this.state.keyName][index]}></Library></span>
            </div>
          )}</span>
        }</span>
      }
    </div>
  </span>);
  }
}

export default Library;
