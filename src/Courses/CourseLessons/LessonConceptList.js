import React, {Component} from 'react';
import './LessonConceptList.css';

class LessonFileList extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      conceptSearch : {data:[]},
      concepts:props.concepts
    };
    this.addLessonXConcept = this.addLessonXConcept.bind(this);
    this.getConceptSearch = this.getConceptSearch.bind(this);
    this.deleteConceptLesson = this.deleteConceptLesson.bind(this);
    this.getLessonConcepts = this.getLessonConcepts.bind(this);
  }

  componentDidMount() {
    var input = document.getElementById("search_input");
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("search_button").click();
        }
    });
  }

  addLessonXConcept(concept, uri){
    var newConcept = JSON.parse(JSON.stringify(concept));
    var data = {
      lesson_id_number:this.props.lesson_id,
      concept_id_number:uri
    }

    for(var i = 0; i < this.state.concepts.data.length; i++){
      if(this.state.concepts.data[i].id==uri){
        return;
      }
    }
    concept["con_id"] = -1
    var concepts = this.state.concepts
    concepts.data.push(concept)
    this.setState({
      concepts:concepts
    });
    try{
      window.simpleDjangoPost(window.rest_service_address+"/lesson_x_concept/",data);
    }
    catch(exception){
      console.log(exception);
    }

  }

  getConceptSearch(){
    var search_term = document.getElementById("search_input").value
    var data = window.simpleGet(window.rest_service_address+"/concept_search/?search_query="+search_term+"&&lesson_id="+this.props.lesson_id)
    this.setState({
      conceptSearch:data
    });
  }

  deleteConceptLesson(concept_id){
    if(concept_id==-1){
      alert("Update to enable delete");
      return;
    }
    var url = window.rest_service_address+"/lesson_x_concept/"+concept_id+"/"
    window.simpleDelete(url)
    this.getLessonConcepts()
  }

  getLessonConcepts(){
    var url = window.rest_service_address+"/lesson_concepts/?lesson_id="+this.props.lesson_id
    var data = window.simpleGet(url)
    this.setState({
      concepts:data
    });
  }

  render() {
    return (<div>
      <span className="clickable" onClick={this.props.close}>close</span>&nbsp; &nbsp;<span className="clickable">add uri manually</span>&nbsp; &nbsp;<span onClick={this.getLessonConcepts} className="clickable">update</span>
      <br/>
      <div className = "row">
        <div className = "col-md-6 search_space">
          <input  id = "search_input" className = "search_input" type="text"></input><button id="search_button" onClick={this.getConceptSearch} className="search_button" >Search</button>
          <br/>
          {this.state.conceptSearch.data.map((concept) =>
            <div>
              {concept.concept_label}
              <br />
              <span><a className="small_concept_uri" href={concept.concept_uri}>{concept.concept_uri}</a></span>
              <br />
              <button className="round_button" onClick={()=>this.addLessonXConcept(concept, concept.id)}>Add</button>
              <hr/>
            </div>
          )}
        </div>
        <div className = "col-md-6 concept_space">
          {this.state.concepts.data.map((concept) =>
            <div>
              {concept.concept_label}
              <br />
              <span><a className="small_concept_uri" href={concept.concept_uri}>{concept.concept_uri}</a></span>
              <br />
              <button className="round_button" onClick={()=>this.deleteConceptLesson(concept.con_id)} >Delete</button>
              <hr/>
            </div>
          )}
        </div>
      </div>
    </div>);
  }
}

export default LessonFileList;
