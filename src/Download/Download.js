import React, {Component} from 'react';
import './Download.css';

class Download extends Component {
  constructor(props) {
    super(props);
    this.downloadCourse = this.downloadCourse.bind(this)
  }

  downloadCourse(){
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

    var course_name = document.getElementById('course_name').value
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    var params = {
      username:username,
      password:password,
      course_name:course_name
    }
    var url = "http://172.24.98.22/development/course_x_tag/"
    var path = "/development/download_course/"
    var method =  "post";

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", "post_frame");

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
      <div className="downloadConent">
        <span className="downloadSeperator">Nombre del Curso:</span>
        <br/>
        <input type="text" name="courseURL" id="course_name" className="downloadSeperator"></input>
        <br/>
        <hr/>
        <span className="downloadSeperator">Usuario:</span>
        <br/>
        <input type="text" name="username" id="username" className="downloadSeperator"></input>
        <br/>
        <hr/>
        <span className="downloadSeperator">Contraseña:</span>
        <br/>
        <input type="password" name="password" id="password" className="downloadSeperator"></input>
        <br/>
        <hr/>
        <span>Debes haber inscrito el curso utilizando tu cuenta de coursera previamente. El servidor guardará tus credenciales hasta haber completado la descarga del curso. No recomendamos enviar información de acceso por medio de conexiones http.</span>
        <br/>
        <button className="downloadSeperator" onClick={this.downloadCourse}>Add</button>
    </div>
    <iframe name="post_frame" style="display:hidden"></iframe>
    </div>);
  }
}

export default Download;
