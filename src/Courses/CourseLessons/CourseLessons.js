import React, {Component} from 'react';
import './CourseLessons.css';
import LessonFiles from './LessonFiles/LessonFiles.js';
//import { Dropdown } from 'semantic-ui-react';

class CourseLessons extends Component {
  constructor(props) {
    super(props);
    this.state={
      overlay:2
    }
    this.getCourseLessons = this.getCourseLessons.bind(this);
    this.organizeLessons = this.organizeLessons.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.moveLessonToNewPosition = this.moveLessonToNewPosition.bind(this);
    this.setLessonNext = this.setLessonNext.bind(this);
    this.deleteLessonTag = this.deleteLessonTag.bind(this);
    this.getLessonTags = this.getLessonTags.bind(this);
    this.addLessonXTag = this.addLessonXTag.bind(this);
    this.connectTagsToLessons = this.connectTagsToLessons.bind(this);
    this.updateCall = this.updateCall.bind(this);
    this.initializeTagsToLessons = this.initializeTagsToLessons.bind(this);
    this.connectTagsToSpecificLesson = this.connectTagsToSpecificLesson.bind(this);
    this.updateTagsOfLesson = this.updateTagsOfLesson.bind(this);
  }

  componentWillMount() {
    setTimeout( function(){this.updateInfo();}.bind(this), 100);
  }

  updateInfo(){
    var lessons = this.getCourseLessons()
    var organized_lessons = this.organizeLessons(lessons, lessons.length)
    var tags = this.getTags();
    var lesson_tag_tuple = this.connectTagsToLessons(organized_lessons);
    organized_lessons = lesson_tag_tuple[0];

    var tagOptions = [];
    for(var j = 0;j<tags.length;j++){
      var tagOption ={
        key: tags[j]["id"],
        value: tags[j]["id"],
        text: tags[j]["tag_name"]
      }
      tagOptions.push(tagOption);
    }

    this.setState({
      lessons : lessons,
      organized_lessons : organized_lessons,
      course_tags:lesson_tag_tuple[1],
      tags:tags,
      overlay:0,
      tagOptions:tagOptions,
      loading:false
    });
  }

  updateCall(){
    this.setState({
      overlay:2
    });
    setTimeout( function(){this.updateTags();}.bind(this), 100);
  }

  organizeLessons(lesson_list, arrayLength){
    var organized_lessons = [];
    //Find last element
    var previous_lesson = null;
    for (var i = 0; i < arrayLength; i++) {
      var current_lesson = lesson_list[i];
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
        var current_lesson = lesson_list[i];
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

  connectTagsToLessons(organized_lessons){
    var url = window.rest_service_address+"/course_tags/?course_id="+this.props.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    for(var i = 0; i < organized_lessons.length; i++){
      var current_lesson = organized_lessons[i];
      var current_lesson_tags = data[current_lesson["id"]];
      current_lesson["lesson_tags"] = current_lesson_tags;
      organized_lessons[i] = current_lesson;
    }
    return [organized_lessons, data];
  }

  connectLocalTagsToLessons(organized_lessons){
    var data = this.state.course_tags;
    for(var i = 0; i < organized_lessons.length; i++){
      var current_lesson = organized_lessons[i];
      var current_lesson_tags = data[current_lesson["id"]];
      current_lesson["lesson_tags"] = current_lesson_tags;
      organized_lessons[i] = current_lesson;
    }
    return [organized_lessons, data];
  }

  connectTagsToSpecificLesson(organized_lessons, lesson_id){
    for(var i = 0; i < organized_lessons.length; i++){
      var current_lesson = organized_lessons[i];
      if(current_lesson["id"] == lesson_id){
        var current_lesson_tags = this.getLessonTags(current_lesson["id"]);
        current_lesson["lesson_tags"] = current_lesson_tags;
        organized_lessons[i] = current_lesson;
      }
    }
    var course_tags = this.state.course_tags;
    course_tags[lesson_id]=current_lesson_tags;
    this.setState({
      course_tags:course_tags
    });
    return organized_lessons;
  }

  initializeTagsToLessons(organized_lessons){
    for(var i = 0; i < organized_lessons.length; i++){
      var current_lesson = organized_lessons[i];
      var current_lesson_tags = [];
      current_lesson["lesson_tags"] = current_lesson_tags;
      organized_lessons[i] = current_lesson;
    }
    return organized_lessons;
  }

  updateTags(){
    const xah_deep_copy_array_or_object = (obj => JSON.parse ( JSON.stringify(obj) ) );
    var updated_organized_lessons = this.connectTagsToLessons(xah_deep_copy_array_or_object(this.state.organized_lessons));
    this.setState({
      organized_lessons:updated_organized_lessons,
      overlay:0
    });
    return updated_organized_lessons;
  }

  updateTagsOfLesson(lesson_id){
    const xah_deep_copy_array_or_object = (obj => JSON.parse ( JSON.stringify(obj) ) );
    var updated_organized_lessons = this.connectTagsToSpecificLesson(xah_deep_copy_array_or_object(this.state.organized_lessons), lesson_id);
    this.setState({
      organized_lessons:updated_organized_lessons,
      overlay:0
    });
    return updated_organized_lessons;
  }

  moveLessonToNewPosition(lesson_id, newPosition){
    setTimeout( function(){
      try{
        var arrayLength = this.state.organized_lessons.length;
        //console.log("Moving "+lesson_id+" to position "+newPosition+" in a list with length "+arrayLength)

        if (newPosition===null){
          setTimeout( function(){this.updateInfo();}.bind(this), 100);
          alert("Position input must be a number not null.");
          return;
        }
        if (!(newPosition < arrayLength+1) || !(newPosition > 0)){
          setTimeout( function(){this.updateInfo();}.bind(this), 100);
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
            var lesson_in_new_pos_current_position = i;
          }
          if(current_lesson["id"]==lesson_id){
            lesson_to_move_to_position = current_lesson;
            found_lesson_to_move_to_position = true;
            var lesson_to_move_to_position_current_position = i;
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


        if(lesson_to_move_to_position["list_position"]==lesson_in_new_pos["list_position"]){
          return;
        }
        this.state.lessons.slice(0);

        //Object.assign({}, obj_name)
        const xah_deep_copy_array_or_object = (obj => JSON.parse ( JSON.stringify(obj) ) );
        var new_lesson_list = xah_deep_copy_array_or_object(this.state.lessons);
        if(lesson_to_move_to_position!==null && lesson_in_new_pos!==null){

          if(lesson_to_move_to_position["list_position"] > lesson_in_new_pos["list_position"]){
            new_lesson_list = this.setLessonNext(lesson_to_move_to_position["id"], lesson_in_new_pos["id"], new_lesson_list);
            if(lesson_previous_in_new_position!==null){
              new_lesson_list = this.setLessonNext(lesson_previous_in_new_position["id"], lesson_to_move_to_position["id"], new_lesson_list);

            }
            if(lesson_previous_to_move_to_position!==null){
              new_lesson_list = this.setLessonNext(lesson_previous_to_move_to_position["id"], lesson_to_move_to_position["next_lesson_id"], new_lesson_list);

            }
          }
          else{
            new_lesson_list = this.setLessonNext(lesson_to_move_to_position["id"],lesson_in_new_pos["next_lesson_id"], new_lesson_list);
            new_lesson_list = this.setLessonNext(lesson_in_new_pos["id"],lesson_to_move_to_position["id"], new_lesson_list);
            if(lesson_previous_to_move_to_position!==null){
              new_lesson_list = this.setLessonNext(lesson_previous_to_move_to_position["id"], lesson_to_move_to_position["next_lesson_id"], new_lesson_list);
            }
          }
        }
      }
      catch(exception){
        console.log(exception);
        alert("Server connection issue.")
        setTimeout( function(){this.updateInfo();}.bind(this), 100);
        return;
      }
      var new_organized_list = this.organizeLessons(new_lesson_list, this.state.lessons.length);
      new_organized_list = this.connectLocalTagsToLessons(new_organized_list)[0];
      this.setState({
        organized_lessons : new_organized_list,
        lessons : new_lesson_list
      });
    }.bind(this), 100);
  }

  setNewOrganizedList(){

  }

  setLessonNext(lesson_id, next_lesson_id, lesson_list){
    for(var i = 0; i < lesson_list.length;i++){
      var current_lesson = lesson_list[i];
      if(current_lesson["id"]==lesson_id){
        current_lesson["next_lesson_id"]=next_lesson_id;
        lesson_list[i]=current_lesson;
        break;
      }
    }

    var url = window.rest_service_address+"/set_next_lesson/?lesson_id="+lesson_id+"&next_lesson_id="+next_lesson_id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    //console.log(xmlHttp.responseText)
    var lessons = JSON.parse(xmlHttp.responseText);
    return lesson_list
  }

  getCourseLessons()
  {
    var url = window.rest_service_address+"/course_lessons/?course_id="+this.props.course.id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    //console.log(xmlHttp.responseText)
    var lessons = JSON.parse(xmlHttp.responseText);
    return lessons
  }

  getTags(){
    var url = window.rest_service_address+"/tags/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    //console.log(xmlHttp.responseText)
    var data = JSON.parse(xmlHttp.responseText);
    return data
  }

  getLessonTags(lesson_id, tag_dictionary){
    var url = window.rest_service_address+"/lesson_tags/?lesson_id="+lesson_id
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var data = JSON.parse(xmlHttp.responseText);
    //console.log(data)
    return data
  }

  deleteLessonTag(tag_id, lesson_id){
    setTimeout( function(){
      console.log("XMLHTTP");
      if(tag_id==-2){
        alert("Update information to enable delete.");
        return;
      }

      var url = window.rest_service_address+"/lesson_x_tag/"+tag_id+"/"
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "DELETE", url, true ); // false for synchronous request
      xmlHttp.send( null );
      const xah_deep_copy_array_or_object = (obj => JSON.parse ( JSON.stringify(obj) ) );
      console.log("clone list");
      var updated_organized_lessons = this.state.organized_lessons;
      console.log("Searching");
      for(var i =0;i < updated_organized_lessons.length;i++){
        var current_lesson= updated_organized_lessons[i];
        if(current_lesson["id"]==lesson_id){
          console.log("Found lesson");
          var lesson_tags = current_lesson["lesson_tags"];
          for(var j = 0;j < lesson_tags.length;j++){
            var current_tag = lesson_tags[j];
            if(current_tag["id"]==tag_id){
              console.log("Found tag")
              lesson_tags.splice(j,1);
              break;
            }
          }
          break;
        }
      }
      this.setState({
        organized_lessons : updated_organized_lessons
      });
    }.bind(this), 100);
  }

  addLessonXTag(lesson_id){
    setTimeout( function(){
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
        var tag_name = document.getElementById("tag-to-add-"+lesson_id).options[document.getElementById("tag-to-add-"+lesson_id).selectedIndex].innerHTML

        if(tag_id == "-1"){
          alert("Please select a tag");
          return;
        }
        console.log(tag_id);
        const xah_deep_copy_array_or_object = (obj => JSON.parse ( JSON.stringify(obj) ) );
        var updated_organized_lessons = this.state.organized_lessons;
        for(var i =0;i < updated_organized_lessons.length;i++){
          var current_lesson= updated_organized_lessons[i];
          console.log(lesson_id+"=?"+current_lesson["id"]);
          if(current_lesson["id"]==lesson_id){
            var not_found_tag=true;
            var lesson_tags = current_lesson["lesson_tags"];
            for(var j = 0;j < lesson_tags.length;j++){
              var current_tag = lesson_tags[j];
              console.log(tag_id+"=?"+current_tag["tag_id_number"]);
              console.log(current_tag);
              if(parseInt(current_tag["tag_id_number"])==parseInt(tag_id)){
                not_found_tag=false;
                console.log("Tag Found in Lesson")
                break;
              }
            }
            if(not_found_tag){
              lesson_tags.push({id:-2,tag_name:tag_name,tag_id_number:tag_id})
            }
            break;
          }
        }
        this.setState({
          organized_lessons : updated_organized_lessons
        });

        var params = {
          lesson_id_number:lesson_id,
          tag_id_number:tag_id
        }
        //console.log(params)
        var url = window.rest_service_address+"/lesson_x_tag/"
        var path = window.rest_service_address+"/lesson_x_tag/"
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
      catch(err){
        console.log(err);
      }
      this.updateCall;

    }.bind(this), 100);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev, lesson) {
      ev.dataTransfer.setData("lesson_id", lesson.id);
  }

  drop(ev, lesson) {
      ev.preventDefault();
      var lesson_id = ev.dataTransfer.getData("lesson_id");
      this.moveLessonToNewPosition(lesson_id, lesson.list_position)
  }

  render() {
    return (<div>
      { this.state.overlay == 0 && <div>

        {this.state.organized_lessons.map((lesson) =>
          <div className="lesson row" onDrop={(event) => this.drop(event, lesson)}  onDragOver={(event) => this.allowDrop(event)}>
            <span className="grab_area col-1" draggable="true" onDragStart={(event) => this.drag(event, lesson)}>
              &#8597;
            </span>
            <div className="col-11">
              <span className="lesson_info">
                {" "+lesson.list_position+" - "}
                {lesson.lesson_name}
              </span>
              <br/>
              <button className="child_size add_tag_button round_button" onClick={()=>this.updateTagsOfLesson(lesson.id)}>&nbsp; &#8635; &nbsp;</button>
              <select className="child_size" id={"tag-to-add-"+lesson.id}>
                <option value="-1"></option>
                {this.state.tags.map((tag) =>
                  <option value={tag.id}>{tag.tag_name}</option>
                )}
              </select>
              <button className="child_size add_tag_button round_button" onClick={()=>this.addLessonXTag(lesson.id)}>&nbsp; + &nbsp;</button>
              <span>{lesson.lesson_tags.map((tag) =>
                  <span className={tag.id == -2 ? "lesson_tag lesson_tag_not_confirmed": "lesson_tag"}>{tag.tag_name}<span className="clickable" onClick={()=>this.deleteLessonTag(tag.id, lesson.id)}>&#9746;</span></span>
              )}
            </span>
          </div>
          <hr/>
        </div>
        )}
      </div>
    }
      {this.state.overlay == 1 &&
        <LessonFiles>

        </LessonFiles>
      }
      {this.state.overlay == 2 &&
        <p>
          Loading...
        </p>
      }
      <iframe name="post_frame" style={{display:"none"}}></iframe>
    </div>);
  }
}

export default CourseLessons;

/**
<select id={"tag-to-add-"+lesson.id}>
  {this.state.tags.map((tag) =>
    <option value={tag.id}>{tag.tag_name}</option>
  )}
</select>
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
