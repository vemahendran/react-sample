import React, { Component } from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';

import { without, findIndex } from 'lodash';

class App extends Component {

  constructor(){
    super();
    this.state = {
      myAppointments: [],
      lastIndex: 0,
      orderBy: 'ownerName',
      orderDir: 'asc',
      queryText: '',
      formDisplay: false
    }

    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointments = this.addAppointments.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(name, value, id){
    let tmpApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id
    });
    tmpApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tmpApts
    });
  }

  searchApts(query){
    this.setState({
      queryText: query
    });
  }

  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir
    });
  }

  addAppointments(apt) {
    let tmpApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;

    tmpApts.unshift(apt);
    this.setState({
      myAppointments: tmpApts,
      lastIndex: this.state.lastIndex + 1
    });
  }

  deleteAppointment(apt){
    let tmpApts = this.state.myAppointments;
    tmpApts = without(tmpApts, apt);

    this.setState({
      myAppointments: tmpApts
    })
  }
  toggleForm(){
    this.setState({
      formDisplay: !this.state.formDisplay
    })
  }

  componentDidMount(){
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({
            lastIndex: this.state.lastIndex + 1
          })
          return item;
        });
        this.setState({
          myAppointments: apts
        }); 

      })
  }

  render() {

    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((firstItem, secondItem) => {
      if (firstItem[this.state.orderBy].toLowerCase() < secondItem[this.state.orderBy].toLowerCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(item => {
      return(
        item['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        item['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        item['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase())
      );
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments 
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointments={this.addAppointments} />
                <SearchAppointments 
                  orderBy={this.state.orderBy} 
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts} />
                <ListAppointments appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo} />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

}

export default App;
