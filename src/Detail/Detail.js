import React, {Component} from 'react';
import './Detail.css';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentID: this.props.type,
      contentData:this.props.data
    };
  }
  render() {
    return (<div className="detail_view">
      {this.state.contentID==1 && <Home data={this.state.contentData}></Home>}
      {this.state.contentID==2 && <Pending  data={this.state.contentData}></Pending>}
      {this.state.contentID==3 && <Ready data={this.state.contentData}></Ready>}
      {this.state.contentID==4 && <span>Archivos &nbsp; <Library root={true} data={this.state.contentData}></Library></span>}
    </div>);
  }
}

export default Detail;
