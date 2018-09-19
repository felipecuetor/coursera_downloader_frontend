import React, {Component} from 'react';

class Editing extends Component {
  constructor(props) {
    super(props);
    this.state={
      edit:false,
      element_edit:null
    }
    this.getTags = this.getTags.bind(this)
    this.getCourseTags = this.getCourseTags.bind(this)
    this.getAvailableLanguages = this.getAvailableLanguages.bind(this)
  }

  componentWillMount(){
    var tags = this.getTags()
    this.setState({
      tags:tags
    })
  }


  getTags(){
    var url = "http://172.24.98.22/development/tags/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  getCourseTags(){
    var url = "http://172.24.98.22/development/course_tags/"+this.props.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  getAvailableLanguages(){
    var url = "http://172.24.98.22/development/course_languages/"+this.props.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  addCourseXTag(){
    var cookieValue = null;
    var name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    var tag_id = document.getElementById("selected_tag").value
    var params = {
      username:"http://172.24.98.22/development/courses/"+this.props.course.id,
      password:"http://172.24.98.22/development/tags/"+tag_id
    }
    var url = "http://172.24.98.22/development/course_x_tag/"
    var path = "/course_x_tag/"
    var method =  "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }
    var hiddenField1 = document.createElement("input");
    hiddenField1.setAttribute("type", "hidden");
    hiddenField1.setAttribute("name", 'csrfmiddlewaretoken');
    hiddenField1.setAttribute("value", cookieValue);
    form.appendChild(hiddenField1);

    document.body.appendChild(form);
    form.submit();
  }

  render() {
    return (<div>
      <h3>Datos</h3>
      <table>
        <tr>
          <td>id</td>
          <td>{this.props.course.id}</td>
        </tr>
        <tr>
          <td>course_name</td>
          <td>{this.props.course.course_name}</td>
        </tr>
        <tr>
          <td>course_revised</td>
          <td>{this.props.course.course_revised ? <span>True</span> : <span>False</span>}</td>
        </tr>
        <tr>
          <td>course_download_available</td>
          <td>{this.props.course.course_download_available ? <span>True</span> : <span>False</span>}</td>
        </tr>
        <tr>
          <td>course_error</td>
          <td>{this.props.course.course_error ? <span>True</span> : <span>False</span>}</td>
        </tr>
      </table>
      <br/>
      <h3>Exportar subtitulos:</h3>
      <div>
        <select>
          <option value="en">en</option>
          <option value="es">es</option>
          <option value="fr">fr</option>
        </select>
        <button>Descargar</button>
      </div>
      <h3>Manejar Tags</h3>
      <div>
        <table>
          <tr>
            <td>actual</td>
            <td><button>Eliminar</button></td>
          </tr>
        </table>
        <select id="selected_tag">
          {this.state.tags.map((tag) =>
            <option value={tag.id}>{tag.tag_name}</option>
          )}

        </select>
        <button onClick={()=>this.addCourseXTag()}>agregar</button>
      </div>

    </div>);
  }
}

export default Editing;
