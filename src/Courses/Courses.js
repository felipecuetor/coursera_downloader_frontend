import React, {Component} from 'react';
import Editing from './Editing/Editing.js';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state={
      edit:false,
      element_edit:null
    }
    this.getCourses = this.getCourses.bind(this)
  }

  componentWillMount(){
    var courses = this.getCourses()

    this.setState({
      courses:courses
    })
  }

  openCourseEditor(course){
    this.setState({
      edit:true,
      element_edit:course
    })
  }

  getCourses()
  {
    var url = "http://172.24.98.22/development/courses/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var courses = JSON.parse(xmlHttp.responseText);
    return courses
  }

  render() {
    return (<div>
      { !(this.state.edit) &&
        <span>
          {this.state.courses.map((course) =>
            <span className = "float_cube">
              <p className="clickable">{course.course_name}</p>
              <p className = "clickable" onClick={() => this.openCourseEditor(course)}>Editar</p>
              <p className = "clickable">Archivos</p>
            </span>
          )}
        </span>
      }
      { this.state.edit &&
        <Editing course={this.state.element_edit}>
        </Editing>
      }

    </div>);
  }
}

export default Courses;
