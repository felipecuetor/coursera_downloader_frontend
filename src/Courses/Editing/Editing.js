import React, {Component} from 'react';
import './Editing.css';

class Editing extends Component {
  constructor(props) {
    super(props);
    this.state={
      edit:false,
      element_edit:null,
      course:this.props.course
    }
    this.getTags = this.getTags.bind(this)
    this.getCourseTags = this.getCourseTags.bind(this)
    this.getAvailableLanguages = this.getAvailableLanguages.bind(this)
    this.deleteCourseTag = this.deleteCourseTag.bind(this)
    this.toggleRevised = this.toggleRevised.bind(this)
  }

  componentWillMount(){
    var course_langs = this.getAvailableLanguages();
    this.setState({
      course_langs:course_langs
    })
  }


  getTags(){
    var url = window.rest_service_address+"/tags/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  getCourseTags(){
    var url = window.rest_service_address+"/course_tags/?course_id="+this.state.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    console.log(data)
    return data
  }

  deleteCourseTag(tag_id){
    var url = window.rest_service_address+"/course_x_tag/"+tag_id+"/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "DELETE", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var course_tags = this.getCourseTags();
    this.setState({
      course_tags:course_tags
    })
  }

  getAvailableLanguages(){
    var url = window.rest_service_address+"/course_languages/?course_id="+this.state.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  toggleRevised(course_id){
    var url = window.rest_service_address+"/course_toggle_revised/?course_id="+this.state.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    var new_course = this.state.course
    new_course["course_revised"] = !new_course["course_revised"];
    this.setState({
      course:new_course
    });
  }

  getFilesOfLanguages(){
    var language = document.getElementById("language").value
    var url = window.rest_service_address+"/course_lang_files/?course_id="+this.state.course.id+"&language="+language
    window.open(url,'_blank');
  }

  addCourseXTag(){
    try{
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
        course_id_number:this.state.course.id.toString(),
        tag_id_number:tag_id
      }
      console.log(params)
      var url = window.rest_service_address+"/course_x_tag/"
      var path = window.rest_service_address+"/course_x_tag/"
      var method =  "post"; // Set method to post by default if not specified.

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
    catch(exception){
      console.log(exception)
    }

    console.log("Getting updated course tags")
    var course_tags = this.getCourseTags();
    this.setState({
      course_tags:course_tags
    })
  }

  render() {
    return (<div>
      <h3>Datos</h3>
      <table>
        <tr>
          <td>id</td>
          <td>{this.state.course.id}</td>
        </tr>
        <tr>
          <td>course_name</td>
          <td>{this.state.course.course_name}</td>
        </tr>
        <tr>
          <td>course_revised</td>
          <td><button onClick={this.toggleRevised}>{this.state.course.course_revised ? <span>True</span> : <span>False</span>}</button></td>
        </tr>
        <tr>
          <td>course_download_available</td>
          <td>{this.state.course.course_download_available ? <span>True</span> : <span>False</span>}</td>
        </tr>
        <tr>
          <td>course_error</td>
          <td>{this.state.course.course_error ? <span>True</span> : <span>False</span>}</td>
        </tr>
      </table>
      <br/>
      <h3>Export subtitles:</h3>
      <div>
        <select id="language">

          {this.state.course_langs.map((lang) =>
            <option value={lang.language}>{lang.language}</option>
          )}
        </select>
        <button onClick={()=>this.getFilesOfLanguages()}>Descargar</button>
      </div>

      <iframe name="post_frame" style={{display:"none"}}></iframe>

    </div>);
  }
}

export default Editing;
