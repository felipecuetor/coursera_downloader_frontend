import React, {Component} from 'react';
import Editing from './Editing/Editing.js';
import CourseFiles from './CourseFiles/CourseFiles.js';
import CourseLessons from './CourseLessons/CourseLessons.js';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state={
      edit:0,
      course_files: false,
      element_edit:null,
      element_course_files:null
    }
    this.getCourses = this.getCourses.bind(this)
    this.closeDetail = this.closeDetail.bind(this)
    this.openCourseFiles = this.openCourseFiles.bind(this)
  }

  closeDetail(){
    this.setState({
      edit:0,
      course_files: false
    })
  }

  componentWillMount(){
    var courses = this.getCourses()
    this.setState({
      courses:courses
    })
  }

  openCourseEditor(course){
    this.setState({
      edit:1,
      element_edit:course
    })
  }

  openCourseFiles(course){
    this.setState({
      edit:2,
      element_course_files:course
    })
  }

  openCourseLessons(course){
    this.setState({
      edit:3,
      element_course_lessons:course
    })
  }

  getCourses()
  {
    var url = "http://localhost:80/development/courses/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    var courses = JSON.parse(xmlHttp.responseText);
    return courses
  }

  render() {
    return (<div>
      {
        this.state.edit == 0 &&
        <span>
          {this.state.courses.map((course) =>
            <span className = "float_cube">
              <p>{course.course_name}</p>
              <p className = "clickable" onClick={() => this.openCourseEditor(course)}>Edit</p>
              <p className = "clickable"  onClick={() => this.openCourseFiles(course)}>Files</p>
              <p className = "clickable"  onClick={() => this.openCourseLessons(course)}>Lessons</p>
            </span>
          )}
        </span>
      }
      {
        this.state.edit == 1 &&
        <Editing course={this.state.element_edit}>
        </Editing>
      }
      {
        this.state.edit == 2 &&
        <CourseFiles course={this.state.element_course_files}>
        </CourseFiles>
      }
      {
        this.state.edit == 3 &&
        <CourseLessons course={this.state.element_course_lessons}>
        </CourseLessons>
      }
    </div>);
  }
}

export default Courses;
