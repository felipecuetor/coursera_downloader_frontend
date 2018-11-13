import React, {Component} from 'react';
import './LessonConceptList.css';

class LessonFileList extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      conceptSearch : [],
      concepts:props.concepts
    };
    this.addLessonXConcept = this.addLessonXConcept.bind(this);
  }

  addLessonXConcept(uri){
    var data = {
      lesson_id_number:this.props.lesson_id,
      concept_uri:uri
    }
    window.simpleDjangoPost(window.rest_service_address+"/lesson_x_concept/",data);
  }

  getConceptSearch(search_term){
    var query = [
       "PREFIX dbpedia2: <http://dbpedia.org/resource/>",
       "PREFIX Abs: <http://dbpedia.org/ontology/>",
       "SELECT ?abstract",
       "WHERE {",
          "?s dbpedia2:Civil_engineeringe\"@en;",
          "Abs:abstract ?abstract",
       "}"
      ].join(" ");
    var data = window.simpleGet(window.concept_service+"/?query="+ encodeURIComponent(query) +"&format=json")
    this.setState({
      conceptSearch:data
    });
  }

  render() {
    return (<div>
      <span className="clickable" onClick={this.props.close}>close</span>&nbsp; &nbsp;<span className="clickable">Add URI manually</span>
      <br/>
      <div className = "row">
        <div className = "col-md-6 search_space">
          <input className = "search_input" type="text"></input><button className="search_button" >Search</button>
          <br/>
          {this.state.conceptSearch.map((concept) =>
            <p>{concept} <button className="round_button">Add</button></p>
          )}
        </div>
        <div className = "col-md-6 concept_space">
          {this.state.concepts.map((concept) =>
            <p>{concept.concept_uri} <button className="round_button">X</button></p>
          )}
        </div>
      </div>
    </div>);
  }
}

export default LessonFileList;
