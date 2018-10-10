import React, {Component} from 'react';
import './CourseLessons.css';

class CourseLessons extends Component {
  constructor(props) {
    super(props);
    this.getCourseLessons = this.getCourseLessons.bind(this);
    this.organizeLessons = this.organizeLessons.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.moveLessonToNewPosition = this.moveLessonToNewPosition.bind(this);
    this.setLessonNext = this.setLessonNext.bind(this);
    this.deleteLessonTag = this.deleteLessonTag.bind(this);
    this.getLessonTags = this.getLessonTags.bind(this);
    this.addLessonXTag = this.addLessonXTag.bind(this);
  }

  componentWillMount() {
    this.updateInfo();
  }

  updateInfo(){
    var lessons = this.getCourseLessons()
    var organized_lessons = this.organizeLessons(lessons)
    var tags = this.getTags();

    for(var i = 0; i < organized_lessons.length; i++){
      var current_lesson = organized_lessons[i];
      var current_lesson_tags = this.getLessonTags(current_lesson["id"])
      current_lesson["lesson_tags"] = current_lesson_tags;
      organized_lessons[i] = current_lesson;
    }

    this.setState({
      lessons : lessons,
      organized_lessons : organized_lessons,
      tags:tags
    });
  }

  organizeLessons(lessons){
    var organized_lessons = [];
    var arrayLength = lessons.length;
    //Find last element
    var previous_lesson = null;
    for (var i = 0; i < arrayLength; i++) {
      var current_lesson = lessons[i];
      if(current_lesson["next_lesson_id"]==0){
        previous_lesson = current_lesson;
        previous_lesson["list_position"] = arrayLength;
        organized_lessons.unshift(previous_lesson);
        break;
      }
    }
    //Find next object iterating
    var list_reverse_position=1;
    var list_continues = true;
    while(list_continues) {
      var found_next = false;
      for (var i = 0; i < arrayLength; i++) {
        var current_lesson = lessons[i];
        if(current_lesson["next_lesson_id"]==previous_lesson["id"])
        {
          previous_lesson = current_lesson;
          previous_lesson["list_position"] = arrayLength-list_reverse_position;
          organized_lessons.unshift(previous_lesson);
          found_next = true;
          list_reverse_position = list_reverse_position+1;
        }
      }
      if(!found_next)
      {
        list_continues = false;
        break;
      }
    }
    return organized_lessons;
  }

  moveLessonToNewPosition(lesson_id){
    var arrayLength = this.state.organized_lessons.length;
    var newPosition = document.getElementById("input_"+lesson_id).value;
    console.log("Moving "+lesson_id+" to position "+newPosition+" in a list with length "+arrayLength)

    if (newPosition===null){
      this.updateInfo();
      alert("Position input must be a number not null.");
      return;
    }
    if (!(newPosition < arrayLength+1) || !(newPosition > 0)){
      this.updateInfo();
      alert("Position input must be a number between 0 and the list size");
      return;
    }
    var lesson_in_new_pos = null;
    var lesson_to_move_to_position = null;
    var lesson_previous_to_move_to_position = null;

    var found_lesson_in_new_pos = false;
    var found_lesson_to_move_to_position = false;
    var found_lesson_previous_to_move_to_position = false;
    var continue_iterating = true;
    for (var i = 0; (i < arrayLength) && continue_iterating; i++) {
      var current_lesson = this.state.organized_lessons[i];
      if(current_lesson["list_position"]==newPosition){
        lesson_in_new_pos = current_lesson;
        found_lesson_in_new_pos = true;
      }
      if(current_lesson["id"]==lesson_id){
        lesson_to_move_to_position = current_lesson;
        found_lesson_to_move_to_position = true;
      }

      if(current_lesson["next_lesson_id"]==lesson_id){
        lesson_previous_to_move_to_position = current_lesson;
        found_lesson_previous_to_move_to_position = true;
      }

      if(found_lesson_in_new_pos && found_lesson_to_move_to_position && found_lesson_previous_to_move_to_position){
        continue_iterating = false;
      }
    }
    var lesson_previous_in_new_position = null;
    if(lesson_in_new_pos !== null){
      for (var i = 0; (i < arrayLength); i++) {
        var current_lesson = this.state.organized_lessons[i];
        if(current_lesson["next_lesson_id"]==lesson_in_new_pos["id"]){
          lesson_previous_in_new_position = current_lesson;
          break;
        }
      }
    }
    else{
      for (var i = 0; (i < arrayLength); i++) {
        var current_lesson = this.state.organized_lessons[i];
        if(current_lesson["next_lesson_id"]==0){
          lesson_previous_in_new_position = current_lesson;
          break;
        }
      }
    }

    if(lesson_to_move_to_position["list_position"]==lesson_in_new_pos["list_position"]-1){
      alert("To switch the position of 2 adjacent elements, set the position of the second element.");
      return;
    }

    if(lesson_to_move_to_position["list_position"]==lesson_in_new_pos["list_position"]){
      return;
    }

    if(lesson_to_move_to_position!==null && lesson_in_new_pos!==null){
      this.setLessonNext(lesson_to_move_to_position["id"], lesson_in_new_pos["id"]);

      if(lesson_previous_in_new_position!==null) this.setLessonNext(lesson_previous_in_new_position["id"], lesson_to_move_to_position["id"]);
      if(lesson_previous_to_move_to_position!==null) this.setLessonNext(lesson_previous_to_move_to_position["id"], lesson_to_move_to_position["next_lesson_id"]);
    }
    this.updateInfo();
  }

  setLessonNext(lesson_id, next_lesson_id){
    var url = "http://localhost:80/development/set_next_lesson/?lesson_id="+lesson_id+"&next_lesson_id="+next_lesson_id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText)
    var lessons = JSON.parse(xmlHttp.responseText);
    return lessons
  }

  getCourseLessons()
  {
    var url = "http://localhost:80/development/course_lessons/?course_id="+this.props.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText)
    var lessons = JSON.parse(xmlHttp.responseText);
    return lessons
  }

  getTags(){
    var url = "http://localhost:80/development/tags/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText)
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  getLessonTags(lesson_id){
    var url = "http://localhost:80/development/lesson_tags/?lesson_id="+lesson_id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    console.log(data)
    return data
  }

  deleteLessonTag(tag_id){
    var url = "http://localhost:80/development/lesson_x_tag/"+tag_id+"/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "DELETE", url, false ); // false for synchronous request
    xmlHttp.send( null );
    this.updateInfo();
  }

  addLessonXTag(lesson_id){
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

      var tag_id = document.getElementById("tag-to-add-"+lesson_id).value
      var params = {
        lesson_id_number:lesson_id,
        tag_id_number:tag_id
      }
      console.log(params)
      var url = "http://localhost:80/development/lesson_x_tag/"
      var path = "http://localhost:80/development/lesson_x_tag/"
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
    this.updateInfo()
  }


  render() {
    return (<div>
      {this.state.organized_lessons.map((lesson) =>
        <div className="lesson">
          <span>
            {lesson.list_position}
            <input id={"input_"+lesson.id} className="lesson_position" type="number" defaultValue={lesson.list_position}>
            </input>
            <button id={"btn"+lesson.id} onClick={() => this.moveLessonToNewPosition(lesson.id)} className="move_postion_button">
              Move
            </button>
            {lesson.lesson_name}
          </span>
          <br/>
          <select id={"tag-to-add-"+lesson.id}>
            {this.state.tags.map((tag) =>
              <option value={tag.id}>{tag.tag_name}</option>
            )}
          </select>
          <button onClick={()=>this.addLessonXTag(lesson.id)}>add</button>
          <span>{lesson.lesson_tags.map((tag) =>
              <span className="lesson_tag">{tag.tag_name} <span className="clickable" onClick={()=>this.deleteLessonTag(tag.id)}>&#9746;</span></span>
          )}
        </span>
          <hr/>
        </div>
      )}

      <iframe name="post_frame" style={{display:"none"}}></iframe>
    </div>);
  }
}

export default CourseLessons;

/**
<h3>Manejar Tags</h3>
<div>

  <select id="selected_tag">
    {this.state.tags.map((tag) =>
      <option value={tag.id}>{tag.tag_name}</option>
    )}

  </select>
  <button onClick={()=>this.addCourseXTag()}>agregar</button>

  <table>

  {this.state.course_tags.map((course_tag) =>
    <tr>
      <td>{course_tag.tag_name}</td>
      <td><button className="fill_width" onClick={()=>this.deleteCourseTag(course_tag.id)}> Eliminar </button></td>
    </tr>
  )}

  </table>
</div>

*/
