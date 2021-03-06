import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'   // makes the calls to our api
import auth from './authenticate'

// Add text to the cart: <!-- <p class="card-text"></p> -->
class Doctors extends Component {

  constructor(props) {
    super(props);
    this.state = {
      doctors: null,
      isAdmin: true,
      error: null
    }
  }

  // make the api call when this component is mounted:
  async componentDidMount() {
    await axios.get('http://localhost:8080/api/users', { withCredentials: true })
      .then(response => {
        this.setState({ doctors: response.data })
      })
      .catch(error => {
        this.setState({ error: error.response.data.reason })
      })
  }

  // TODO: Add a link to edit each doctor
  render() {
    return(
      <div className="container">
        { /*  create new user 
              TODO: Only show this menu to admin */}
        { this.state.error && 
          <div className="alert alert-danger" role="alert">
            Error while connecting to the server: { this.state.error }
          </div>
        }
        { this.state.isAdmin && this.state.error == null && 
        <Link to="/newUser">
              <div className="card text-white bg-secondary mb-3">
                <div className="card-body">
                  <h4 className="card-title">+ Add a new user</h4>
                </div>
              </div>
        </Link>
        }
        { this.state.doctors === null && this.state.error == null && <h5>Loading ...</h5>}
          <table className="table table-dark">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
        { this.state.doctors && this.state.doctors.map((doctor, i) => (
                <tr key={i}>
                  <td>{ doctor.firstName }</td> 
                  <td>{ doctor.lastName }</td>
                  <td>{ doctor.email }</td>
                  <td>{ doctor.role }</td>
                  <td><Link to={ {
                      pathname: `/doctor/patients/${doctor.id}`
                  } }>Patients</Link></td>
                  { /* Only show link to edit user for admin or user itself */ }
                  { auth.user != null && (auth.user.email === doctor.email || auth.user.role === "admin") ?
                    <td><Link to={ {
                      /* TODO: Could we directl write in the Linked Components state ? */
                      pathname: `/user/edit/${doctor.id}`,
                      state: { 
                        firstName: doctor.firstName ,
                        lastName: doctor.lastName,
                        email: doctor.email,
                        role: doctor.role,
                      }
                    } }>Edit</Link></td>
                  : <td></td>
                  }
                </tr>
          ))
        }
        </tbody>
        </table>
        </div>
        
    )
  }
}

export default Doctors