import React, {Component} from 'react';
import './MovePopUpInput.css';

class MovePopUpInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentID: this.props.fileData.file_id,
      contentData:this.props.fileData.file_name
    };

    this.move_file = this.move_file.bind(this);
  }

  move_file(){
    var new_file_location = document.getElementById('new_location').value;
    var url = window.rest_service_address+"/file_detail/"+this.state.file_id+"/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "PUT", url, false ); // false for synchronous request
    xmlHttp.send( {"file_course_location":new_file_location} );
    var directory_tree = JSON.parse(xmlHttp.responseText);
  }

  render() {
    return (<div className="PopUp">
      <div className="PopUpContent">
        <p className="PopUpDescription">Escribe la nueva ruta del archivo. Entre cada carpeta coloca el simbolo &gt;&gt;&gt;. Al final debes incluir el nombre del archivo.</p>
        <input id="new_location" type="text" className="PopUpInput"></input>
        <button onClick={this.move_file} className="PopUpInput">Mover</button>
        <button onClick={this.props.exitPopUp} className="PopUpInput">Cancelar</button>
      </div>
      </div>);
  }
}

export default MovePopUpInput;
