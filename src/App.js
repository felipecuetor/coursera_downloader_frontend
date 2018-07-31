import React, {Component} from 'react';
import './App.css';
import Home from './Home/Home.js';
import Library from './Library/Library.js';
import Download from './Download/Download.js';
import Tutorial from './Tutorial/Tutorial.js';
import featured from './DevelopmentTestFiles/featured.json';
import library from './DevelopmentTestFiles/library.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentID: 1,
      contentData:featured
    };
    this.setContent = this.setContent.bind(this);
  }

  setContent(currentContent){
    var currentContentData={};
    if(currentContent==1){
      currentContentData=featured;
    }
    if(currentContent==2){
      currentContentData=library;
    }
    this.setState({
      contentID:currentContent,
      contentData:currentContentData
    });

  }

  render() {
    return (<div>
      <header>
          <h1>Cursera Downloader</h1>
      </header>
      <div className="container">
        <div className="row">
        <span id="sidebar" className="col-md-3">
          <button className="sidebar_button" onClick={() => this.setContent(1)}>Destacados</button>
          <br/>
          <button className="sidebar_button" onClick={() => this.setContent(2)}>Librería</button>
          <br/>
          <button className="sidebar_button" onClick={() => this.setContent(3)}>Decargar</button>
          <br/>
          <button className="sidebar_button" onClick={() => this.setContent(4)}>Tutorial</button>
        </span>

        <span id="mainContent" className="col-md-9">
          {this.state.contentID==1 ? <Home data={this.state.contentData}></Home> : <span></span>}
          {this.state.contentID==2 ? <Library data={this.state.contentData}></Library> : <span></span>}
          {this.state.contentID==3 ? <Download></Download> : <span></span>}
          {this.state.contentID==4 ? <Tutorial></Tutorial> : <span></span>}
        </span>
      </div>
      </div>
    </div>);
  }
}

export default App;
